import dash
import dash_bootstrap_components as dbc
from templates.landing import create_landing_page

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP], title="NET-SKYPLOT")

app.layout = create_landing_page()

if __name__ == '__main__':
    app.run_server(host='0.0.0.0', port=80, debug=True)
