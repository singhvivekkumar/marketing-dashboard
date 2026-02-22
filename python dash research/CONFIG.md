# Configuration Guide

## Environment Variables (.env)

The `.env` file controls the dashboard behavior:

```
# Debug mode (shows live updates, errors)
DASH_DEBUG=True

# Server host (0.0.0.0 = accessible from network)
DASH_HOST=0.0.0.0

# Server port
DASH_PORT=8050

# Data folder location
DATA_FOLDER=src/Leads_Data
```

### Change Port Number
Edit `.env`:
```
DASH_PORT=8051
```
Then restart dashboard.

### Run on Different Host
For network access only from localhost:
```
DASH_HOST=127.0.0.1
```

For network access from other machines:
```
DASH_HOST=0.0.0.0
```
Then access via: `http://your-machine-ip:8050`

---

## Customizing the Dashboard

### Adding Custom Filters
Edit [src/CRM_ERP_DASHBOARD.py](src/CRM_ERP_DASHBOARD.py):

Find the filters section (around line 70):
```python
dbc.Col(dcc.Dropdown(
    options=[{"label": i, "value": i} for i in sorted(df["YOUR_COLUMN"].dropna().unique())],
    id="your_filter", multi=True, placeholder="Select..."), md=2),
```

Add to callback inputs (around line 160):
```python
Input("your_filter", "value"),
```

Add to filter logic (around line 190):
```python
if your_filter: dff = dff[dff["YOUR_COLUMN"].isin(your_filter)]
```

### Adding Custom Charts
Add to the layout (around line 130):
```python
dcc.Graph(id="your_chart")
```

Add to callback outputs (around line 160):
```python
Output("your_chart", "figure"),
```

Add to callback function (around line 280):
```python
your_chart_fig = px.bar(dff.groupby("YOUR_COLUMN").size().reset_index(), 
                        x="YOUR_COLUMN", y=0, title="Your Title")
```

Return the figure in the return statement (around line 310).

---

## Performance Optimization

### For Large Datasets (>50k rows)

1. **Pre-filter data**: Create separate Excel files by year/SBU
2. **Enable caching** (add to imports):
```python
from dash import Dash
from flask_caching import Cache

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
cache = Cache(app.server, config={'CACHE_TYPE': 'simple'})

@cache.memoize()
def load_all_excels(folder):
    # ... existing code
```

3. **Pagination**: Use `page_size` in DataTable (already set to 15)

### Database Alternative
Replace Excel loading with SQL:
```python
import pandas as pd
import sqlite3

conn = sqlite3.connect('crm_data.db')
df_raw = pd.read_sql_query("SELECT * FROM leads", conn)
```

---

## Styling & Themes

### Change Bootstrap Theme
In [src/CRM_ERP_DASHBOARD.py](src/CRM_ERP_DASHBOARD.py), line 15:

Available themes:
- `dbc.themes.BOOTSTRAP`
- `dbc.themes.CERULEAN`
- `dbc.themes.COSMO`
- `dbc.themes.FLATLY`
- `dbc.themes.JOURNAL`
- `dbc.themes.LITERA`
- `dbc.themes.LUMEN`
- `dbc.themes.LUX`
- `dbc.themes.MATERIA`
- `dbc.themes.MINTY`
- `dbc.themes.MORPH`
- `dbc.themes.PULSE`
- `dbc.themes.QUARTZ`
- `dbc.themes.SANDSTONE`
- `dbc.themes.SIMPLEX`
- `dbc.themes.SKETCHY`
- `dbc.themes.SLATE`
- `dbc.themes.SOLAR`
- `dbc.themes.SPACELAB`
- `dbc.themes.SUPERHERO`
- `dbc.themes.UNITED`
- `dbc.themes.VAPOR`
- `dbc.themes.YETI`
- `dbc.themes.ZEPHYR`

Example:
```python
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.SUPERHERO])
```

### Add Custom CSS
Create `assets/style.css`:
```css
h1 { color: #003d7a; }
.card { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
```

Dash automatically loads CSS from `assets/` folder.

---

## Deployment

### Using Gunicorn (Production)
```powershell
gunicorn --workers 4 --bind 0.0.0.0:8050 app:app.server
```

### Using Docker
Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:8050", "app:app.server"]
```

Build and run:
```powershell
docker build -t crm-dashboard .
docker run -p 8050:8050 crm-dashboard
```

---

## Monitoring & Logging

### Enable Detailed Logging
Add to [app.py](app.py):
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
```

### Health Check
Add to [src/CRM_ERP_DASHBOARD.py](src/CRM_ERP_DASHBOARD.py):
```python
@app.server.route('/health')
def health():
    return {'status': 'healthy'}
```

Access at: `http://localhost:8050/health`

---

## Security (For Production)

1. **Disable debug mode**:
```
DASH_DEBUG=False
```

2. **Add authentication**:
```python
import dash_auth

VALID_USERNAME_PASSWORD_PAIRS = {
    'admin': 'password123'
}

auth = dash_auth.BasicAuth(
    app,
    VALID_USERNAME_PASSWORD_PAIRS
)
```

3. **Use environment variables for secrets**:
```python
SECRET_KEY = os.getenv('SECRET_KEY')
```

---

For more information, see [README.md](README.md)
