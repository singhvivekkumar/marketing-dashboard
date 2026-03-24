# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

The app will automatically open at http://localhost:3000

### Step 3: Explore the Dashboard
- Click on sidebar items to navigate between sections
- Use tabs at the top to switch between views
- Try the FY (Fiscal Year) selector in the top right

## 📊 What You'll See

### Dashboard Section
- **Overview Tab**: 6 KPI cards, 8 charts, and lost leads table
- **Analysis Tab**: 6 KPI cards and 5 analytical charts
- **Pipeline Tab**: 6 KPI cards, 2 charts, and upcoming deadlines table

### Monitoring Section
- Live system status cards
- 30-day activity chart
- Module usage breakdown

### Monthly Reports Section
- Interactive month selector
- 8 detailed metrics cards
- Monthly value and leads vs BQs charts

### Yearly Analysis Section
- 6 KPI cards
- Year-over-year value growth chart
- Win rate trend analysis
- 5-year summary table

## 🔧 Customization

### Change Colors (Theme)
Edit `src/theme.js`:
```javascript
primary: {
  main: '#2563eb',  // Change this color
  // ... other colors
}
```

### Update Mock Data
Edit `src/mockData.js` to change any data displayed in the dashboard

### Add New Charts
1. Create chart function in `src/components/Charts.js`
2. Import and use in your view component
3. Refer to existing charts for examples

## 🔌 Connect to Real API

### Quick API Integration Example

1. Create a file `src/services/api.js`:
```javascript
export const fetchDashboardData = async (fy) => {
  const response = await fetch(`/api/dashboard?fy=${fy}`);
  return response.json();
};
```

2. Update component to use API:
```javascript
import { fetchDashboardData } from '../services/api';

// In component
useEffect(() => {
  fetchDashboardData(fy).then(setData);
}, [fy]);
```

## 📁 Important Files

| File | Purpose | Edit When |
|------|---------|-----------|
| `src/App.js` | Main app structure | Adding new views/sections |
| `src/theme.js` | Colors & styling | Customizing appearance |
| `src/mockData.js` | All data | Testing with different data |
| `src/components/Sidebar.js` | Navigation menu | Adding menu items |
| `src/components/views/*` | Dashboard views | Creating new views |

## ✨ Key Features

✅ **18 Different Charts** - All interactive and responsive
✅ **4 Main Views** - Dashboard, Monitoring, Reports, Yearly Analysis  
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Tab Navigation** - Multiple tabs in dashboard
✅ **FY Selector** - Switch between fiscal years
✅ **Data Tables** - Sortable tables with styling
✅ **Live Cards** - System monitoring cards
✅ **KPI Cards** - Key metrics with trends

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### Dependencies Not Installing
```bash
rm node_modules
npm install
```

### Charts Not Displaying
Check that Recharts is installed:
```bash
npm install recharts
```

## 📚 Useful Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test

# Eject from Create React App (not reversible)
npm eject
```

## 🎯 Next Steps

1. **Connect Real Data**: Replace mock data with API calls
2. **Add Authentication**: Implement user login
3. **Customize Branding**: Update colors and logo
4. **Add More Charts**: Extend with additional visualizations
5. **Implement Filters**: Add date ranges and advanced filters
6. **Deploy**: Deploy to production environment

## 📞 Need Help?

Refer to:
- `README.md` - Full documentation
- `CONVERSION_GUIDE.md` - Details about React conversion
- Original `marketing_portal_dashboard.html` - Design reference
- Component files - Well-commented code examples

## 🚀 Production Deployment

When ready to deploy:

```bash
# Build optimized production version
npm run build

# Output is in 'build/' folder
# Can be deployed to:
# - Vercel (recommended for React)
# - Netlify
# - AWS S3 + CloudFront
# - Traditional web server
# - Docker container
```

Enjoy your new React dashboard! 🎉
