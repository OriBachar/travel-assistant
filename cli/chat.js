#!/usr/bin/env node

const readline = require("readline");
const http = require("http");
const https = require("https");
const { URL } = require("url");

// Configuration
const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const SESSION_ID = `cli-session-${Date.now()}`;
const USER_ID = "cli-user";
const DEV_MODE =
  process.env.DEV_MODE === "true" || process.argv.includes("--dev");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

// Simple HTTP request function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ data: jsonData, status: res.statusCode });
        } catch (error) {
          resolve({ data: data, status: res.statusCode });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

class TravelAssistantCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.sessionId = SESSION_ID;
    this.userId = USER_ID;
  }

  async start() {
    const modeText = DEV_MODE ? " (Development Mode)" : "";
    console.log(
      `${colors.cyan}${colors.bright}Travel Assistant CLI${modeText}${colors.reset}`
    );
    console.log(
      `${colors.yellow}Type your travel questions and press Enter. Type 'quit' or 'exit' to stop.${colors.reset}`
    );

    if (DEV_MODE) {
      console.log(
        `${colors.cyan}Development mode: Shows API usage and debugging info${colors.reset}`
      );
    }

    console.log("");

    await this.testConnection();

    this.promptUser();
  }

  async testConnection() {
    try {
      const response = await makeRequest(`${API_BASE_URL}/health`);
      if (response.status === 200) {
        console.log(
          `${colors.green}Connected to Travel Assistant API${colors.reset}\n`
        );
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(
        `${colors.red}Failed to connect to API at ${API_BASE_URL}${colors.reset}`
      );
      console.log(
        `${colors.yellow}Make sure your server is running with: npm run dev${colors.reset}\n`
      );
      process.exit(1);
    }
  }

  promptUser() {
    this.rl.question(`${colors.blue}You: ${colors.reset}`, async (input) => {
      if (input.toLowerCase() === "quit" || input.toLowerCase() === "exit") {
        console.log(`${colors.cyan}Goodbye! Happy travels!${colors.reset}`);
        this.rl.close();
        return;
      }

      if (input.trim() === "") {
        this.promptUser();
        return;
      }

      await this.sendMessage(input.trim());
    });
  }

  async sendMessage(message) {
    try {
      console.log(`${colors.yellow}Thinking...${colors.reset}`);

      const response = await makeRequest(
        `${API_BASE_URL}/api/conversation/chat`,
        {
          method: "POST",
          body: {
            message: message,
            sessionId: this.sessionId,
            userId: this.userId,
            context: {}
          }
        }
      );

      if (response.status === 200 && response.data.success) {
        console.log(
          `${colors.green}Ellie: ${colors.reset}${response.data.data.message}`
        );

        // Show development info in dev mode
        if (DEV_MODE) {
          const apisUsed = response.data.data.externalDataUsed
            ? response.data.data.externalDataUsed.join(", ")
            : "None";
          console.log(`${colors.cyan}APIs Used: ${apisUsed}${colors.reset}`);
        }

        console.log("");
      } else {
        const errorMsg = response.data.error || `HTTP ${response.status}`;
        console.log(`${colors.red}Error: ${errorMsg}${colors.reset}\n`);
      }
    } catch (error) {
      console.log(
        `${colors.red}Connection Error: ${error.message}${colors.reset}\n`
      );
    }

    this.promptUser();
  }
}

const cli = new TravelAssistantCLI();
cli.start().catch(console.error);
