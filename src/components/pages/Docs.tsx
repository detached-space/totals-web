import { useState } from "react";
import { BookOpen, Code, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { API_BASE_URL } from "../../lib/api";

export default function Docs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const baseUrl = API_BASE_URL.replace("/api", "");
  const apiBase = API_BASE_URL;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Totals Local Server API Documentation
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete API reference for accessing your financial data
          </p>
        </div>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="h-6 w-6" />
            Getting Started
          </h2>
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Starting the Server</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Open the Totals app on your device</li>
                <li>Navigate to the <strong>Web Dashboard</strong> page</li>
                <li>Tap <strong>Start Server</strong></li>
                <li>Wait for the server to start (you'll see "Server Running!" status)</li>
                <li>Note the server URL displayed (e.g., <code className="bg-muted px-1 rounded">{baseUrl}</code>)</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Accessing the API</h3>
              <p className="text-muted-foreground mb-2">
                Once the server is running, you can access the API from:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Same device:</strong> <code className="bg-muted px-1 rounded">{baseUrl}</code></li>
                <li><strong>Other devices on same network:</strong> <code className="bg-muted px-1 rounded">{baseUrl}</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="h-6 w-6" />
            Base URL
          </h2>
          <div className="bg-card border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              All API endpoints are prefixed with <code className="bg-muted px-2 py-1 rounded">/api/</code>:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm relative group">
              <code>{apiBase}/&lt;endpoint&gt;</code>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => copyToClipboard(`${apiBase}/<endpoint>`, "base-url")}
              >
                {copiedCode === "base-url" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <ChevronRight className="h-6 w-6" />
            Endpoints
          </h2>

          {/* Accounts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Accounts</h3>
            
            <div className="bg-card border rounded-lg p-6 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/accounts</code>
                  </div>
                  <p className="text-muted-foreground">Returns all registered accounts with enriched bank information.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`curl ${apiBase}/accounts`, "accounts-get")}
                >
                  {copiedCode === "accounts-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono">
{`[
  {
    "accountNumber": "1234567890",
    "bank": 1,
    "bankName": "Commercial Bank of Ethiopia",
    "bankShortName": "CBE",
    "balance": 50000.00,
    "accountHolderName": "John Doe",
    "settledBalance": 49000.00,
    "pendingCredit": 1000.00
  }
]`}
                </pre>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/accounts/&lt;bankId&gt;/&lt;accountNumber&gt;</code>
                  </div>
                  <p className="text-muted-foreground">Returns a specific account by bank ID and account number.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`curl ${apiBase}/accounts/1/1234567890`, "account-get")}
                >
                  {copiedCode === "account-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Transactions</h3>
            
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/transactions</code>
                  </div>
                  <p className="text-muted-foreground mb-2">Returns transactions with optional filtering and pagination.</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Query Parameters:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><code>bankId</code> (integer, optional) - Filter by bank ID</li>
                      <li><code>type</code> (string, optional) - CREDIT or DEBIT</li>
                      <li><code>status</code> (string, optional) - PENDING, CLEARED, or SYNCED</li>
                      <li><code>limit</code> (integer, optional) - Results per page (default: 20)</li>
                      <li><code>offset</code> (integer, optional) - Pagination offset (default: 0)</li>
                      <li><code>from</code> (string, optional) - Start date in ISO 8601 format</li>
                      <li><code>to</code> (string, optional) - End date in ISO 8601 format</li>
                    </ul>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`curl "${apiBase}/transactions?bankId=1&type=CREDIT&limit=10"`, "transactions-get")}
                >
                  {copiedCode === "transactions-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/summary</code>
                    </div>
                    <p className="text-muted-foreground">Returns aggregated summary across all accounts.</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`curl ${apiBase}/summary`, "summary-get")}
                  >
                    {copiedCode === "summary-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/summary/by-bank</code>
                    </div>
                    <p className="text-muted-foreground">Returns summary grouped by bank.</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`curl ${apiBase}/summary/by-bank`, "summary-bank-get")}
                  >
                    {copiedCode === "summary-bank-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/summary/by-account</code>
                    </div>
                    <p className="text-muted-foreground">Returns summary for each individual account.</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`curl ${apiBase}/summary/by-account`, "summary-account-get")}
                  >
                    {copiedCode === "summary-account-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Banks */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Banks</h3>
            
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {apiBase}/banks</code>
                  </div>
                  <p className="text-muted-foreground">Returns all supported banks.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`curl ${apiBase}/banks`, "banks-get")}
                >
                  {copiedCode === "banks-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Utility */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Utility</h3>
            
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET {baseUrl}/health</code>
                  </div>
                  <p className="text-muted-foreground">Health check endpoint to verify server is running.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`curl ${baseUrl}/health`, "health-get")}
                >
                  {copiedCode === "health-get" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="h-6 w-6" />
            Examples
          </h2>
          
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">JavaScript/Fetch</h3>
              <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto relative group">
                <pre className="text-xs font-mono">
{`// Get all accounts
fetch('${apiBase}/accounts')
  .then(response => response.json())
  .then(data => console.log(data));

// Get transactions with filters
fetch('${apiBase}/transactions?bankId=1&type=CREDIT&limit=10')
  .then(response => response.json())
  .then(data => console.log(data));`}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => copyToClipboard(`fetch('${apiBase}/accounts')\n  .then(response => response.json())\n  .then(data => console.log(data));`, "js-example")}
                >
                  {copiedCode === "js-example" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="h-6 w-6" />
            Error Handling
          </h2>
          <div className="bg-card border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              All endpoints return standard HTTP status codes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><code className="bg-muted px-1 rounded">200 OK</code> - Request successful</li>
              <li><code className="bg-muted px-1 rounded">400 Bad Request</code> - Invalid request parameters</li>
              <li><code className="bg-muted px-1 rounded">404 Not Found</code> - Resource not found</li>
              <li><code className="bg-muted px-1 rounded">500 Internal Server Error</code> - Server error</li>
            </ul>
          </div>
        </section>

        {/* Notes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="h-6 w-6" />
            Notes
          </h2>
          <div className="bg-card border rounded-lg p-6">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>The server runs on port <code className="bg-muted px-1 rounded">8080</code> by default</li>
              <li>All endpoints return JSON responses</li>
              <li>Date filters use ISO 8601 format: <code className="bg-muted px-1 rounded">YYYY-MM-DDTHH:mm:ssZ</code></li>
              <li>Pagination uses <code className="bg-muted px-1 rounded">limit</code> and <code className="bg-muted px-1 rounded">offset</code> parameters</li>
              <li>Transaction amounts are in ETB (Ethiopian Birr)</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

