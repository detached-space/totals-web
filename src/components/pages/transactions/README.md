# Enterprise Transactions Page

## Overview

A comprehensive, finance-grade transaction management system designed for enterprise use. This page provides transaction discovery, reconciliation, classification, and audit capabilities for SMS-based bank transaction systems.

## Architecture

### Component Structure

```
Transactions.tsx (Main Page)
├── TransactionFiltersPanel (Left Sidebar)
├── SearchBar (Top)
├── BulkActions (Top, conditional)
├── TransactionTable (Center, virtualized)
├── TransactionTotalsBar (Bottom, sticky)
└── TransactionDetailDrawer (Right, slide-out)
```

### State Management

- **Filters**: Comprehensive filter state including date ranges, banks, accounts, amounts, categories, tags, status, and technical filters
- **Selection**: Set-based selection for bulk operations
- **Sorting**: Column-based sorting with direction
- **Columns**: Configurable column visibility and ordering
- **Search**: Global search with regex support

### Key Features

1. **Advanced Filtering**
   - Date ranges (Today, WTD, MTD, QTD, YTD, Custom)
   - Multi-select banks and accounts
   - Direction (Inflow/Outflow/Transfer)
   - Amount ranges
   - Counterparty search
   - Category and tag filtering
   - Status filters (Parsed, Manual, Unclassified, Flagged)
   - Technical filters (confidence score, missing reference, duplicates, SMS sender ID)

2. **Transaction Table**
   - Virtualized rendering for 100k+ rows
   - Sticky columns (Date, Amount)
   - Inline editing (category, counterparty, notes)
   - Row color coding (green=inflow, red=outflow, amber=flagged/unclassified)
   - Sortable columns
   - Multi-select with checkbox

3. **Transaction Detail Drawer**
   - Complete transaction information
   - Immutable raw SMS content
   - Parsing metadata (confidence, regex, errors)
   - Full audit trail
   - Flags and status indicators

4. **Bulk Operations**
   - Assign category
   - Assign counterparty
   - Add tags
   - Mark as reviewed
   - Flag for investigation
   - Export selected

5. **Totals & Reconciliation**
   - Filtered totals (inflow, outflow, net, count)
   - Selected totals
   - Quick stats (avg transaction, largest)
   - Reconciliation status

6. **Search**
   - Global search across reference, counterparty, amount, account
   - Regex mode support
   - Real-time filtering

7. **Export**
   - CSV export (ledger format)
   - Respects filters, sorting, and selection
   - Ready for Excel import

## Performance Optimizations

### Current Implementation

1. **Memoization**: All filtered/sorted/computed data is memoized
2. **Virtualization**: Table uses windowing to render only visible rows
3. **Debounced Search**: Search updates are debounced (can be added)
4. **Lazy Loading**: Drawer content loads only when opened

### Recommended Enhancements

1. **Server-Side Pagination**: For very large datasets (>10k rows), implement server-side pagination
2. **React Window**: Replace custom virtualization with `react-window` or `react-virtualized` for better performance
3. **IndexedDB**: Cache transactions locally for offline access
4. **Web Workers**: Move heavy filtering/sorting to web workers
5. **Debounced Filters**: Debounce filter changes to reduce computation
6. **Column Virtualization**: For tables with many columns, virtualize horizontally

## Data Model Extensions

The Transaction type has been extended with:

- `id`: Unique transaction identifier
- `currency`: Currency code (default: ETB)
- `category`: Transaction category
- `tags`: Array of classification tags
- `notes`: User notes
- `counterparty`: Normalized counterparty name
- `parsingConfidence`: 0-100 confidence score
- `rawSms`: Immutable raw SMS content
- `smsSenderId`: SMS sender identifier
- `smsReceivedAt`: SMS receive timestamp
- `parsingRegex`: Regex pattern used
- `parsingErrors`: Array of parsing errors
- `isDuplicate`: Duplicate flag
- `isFlagged`: Investigation flag
- `isReviewed`: Review status
- `auditTrail`: Array of audit entries

## Usage Notes

### Filtering

Filters are applied in sequence:
1. Date range
2. Bank/Account
3. Direction
4. Amount range
5. Counterparty
6. Category/Tags
7. Status
8. Technical filters
9. Search query

### Inline Editing

Double-click on editable cells (category, counterparty, notes) to edit inline.

### Export

Exports respect:
- Current filters
- Current sort order
- Selected transactions (if any)
- Visible columns

## Future Enhancements

1. **Column Configuration**: Save/load column configurations
2. **Saved Filters**: Save and reuse filter presets
3. **Advanced Export**: Excel with formatting, PDF reports
4. **Batch Import**: Import transactions from CSV/Excel
5. **Duplicate Detection**: Automatic duplicate detection and merging
6. **AI Classification**: Auto-categorize transactions using ML
7. **Reconciliation Tools**: Match transactions across accounts
8. **Audit Reports**: Generate audit reports with change history

## Dependencies

- React 19+
- Radix UI (Sheet, Select, etc.)
- Lucide React (Icons)
- date-fns (Date formatting)
- Tailwind CSS (Styling)

## Installation Notes

If implementing server-side pagination or advanced virtualization, consider adding:

```bash
npm install react-window react-window-infinite-loader
```

For advanced export features:

```bash
npm install xlsx jspdf
```

