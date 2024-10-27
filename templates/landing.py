from dash import html
import dash_bootstrap_components as dbc


def create_landing_page():
    # Navbar layout
    navbar = dbc.NavbarSimple(
        brand="NET-SKYPLOT",
        brand_href="#",
        color="primary",
        dark=True,
        children=[
            dbc.NavItem(dbc.NavLink("Description", href="#description")),
            dbc.NavItem(dbc.NavLink("Features", href="#features")),
            dbc.NavItem(dbc.NavLink("Open Source", href="#open-source")),
            dbc.NavItem(dbc.NavLink("Start Planning", href="#start-planning")),
        ]
    )

    # Carousel layout
    carousel = dbc.Carousel(
        items=[
            {"key": "1", "src": "/assets/images/slider-1.png", "caption": "Satellite Planning Example"},
            {"key": "2", "src": "/assets/images/slider-2.png", "caption": "GNSS Skyplot Visualization"},
            {"key": "3", "src": "/assets/images/slider-3.png", "caption": "Elevation Model Integration"},
        ],
        controls=True,
        indicators=True,
        interval=5000,
        ride="carousel",
        className="mb-5"
    )

    layout = dbc.Container(
        [
            # Navbar
            navbar,

            # Carousel Section
            dbc.Row(
                dbc.Col(
                    [
                        carousel
                    ],
                    width=12
                ),
                className="mb-5"
            ),

            # Project description
            dbc.Row(
                dbc.Col(
                    html.Div(
                        [
                            html.H3("About the Project", className="text-center", id="description"),
                            html.P(
                                "NET-SKYPLOT is a tool for advanced GNSS survey planning. "
                                "It incorporates real-world obstacles, satellite visibility, and DOP analysis. "
                                "Designed to improve survey accuracy with real-time data and open-source integration.",
                                className="lead"
                            )
                        ],
                        className="mb-5"
                    ),
                    width=12
                )
            ),

            # Start Planning button
            dbc.Row(
                dbc.Col(
                    html.Div(
                        [
                            dbc.Button("Start Planning", id="start-planning-btn start-planning", href="/settings",
                                       color="primary",
                                       className="btn-lg")
                        ],
                        className="text-center mb-5"
                    ),
                    width=12
                )
            ),

            # Features section
            dbc.Row(
                dbc.Col(
                    html.Div(
                        [
                            html.H3("Features", className="text-center", id="features"),
                            html.Ul(
                                [
                                    html.Li("GNSS survey planning with real-time satellite visibility"),
                                    html.Li("Digital elevation model (DEM) integration for obstacle analysis"),
                                    html.Li("Advanced DOP analysis and skyplot visualization"),
                                    html.Li("Customizable parameters for specific locations and times"),
                                    html.Li("Open-source and community-driven development")
                                ],
                                className="lead"
                            )
                        ],
                        className="mb-5"
                    ),
                    width=12
                )
            ),

            # Open-source data section
            dbc.Row(
                dbc.Col(
                    html.Div(
                        [
                            html.H3("Open Source", className="text-center", id="open-source"),
                            html.P(
                                "NET-SKYPLOT is an open-source project. Contribute to the development "
                                "and explore the code on our GitHub repository.",
                                className="lead"
                            ),
                            dbc.Button("View on GitHub", href="https://github.com/your-repo-link", target="_blank",
                                       color="dark"),
                        ],
                        className="text-center mb-5"
                    ),
                    width=12
                )
            )
        ],
        fluid=True
    )

    return layout
