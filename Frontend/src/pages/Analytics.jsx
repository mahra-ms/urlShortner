import { Link, useParams } from "react-router-dom";

function Analytics() {

    const { id } = useParams();

    return (
        <div className="dashboard-page">

            <nav className="dashboard-nav">

                <Link to="/" className="logo">
                    Short<span>ly</span>
                </Link>

                <Link
                    to="/dashboard"
                    className="secondary-button"
                >
                    ← Dashboard
                </Link>

            </nav>


            <main className="dashboard-container">

                <p className="eyebrow">
                    ANALYTICS
                </p>

                <h1>
                    URL Analytics
                </h1>


                <div className="analytics-url">

                    <span>
                        Short URL
                    </span>

                    <strong>
                        shortly.app/example
                    </strong>

                </div>


                <div className="analytics-grid">

                    <div className="stat-card">

                        <p>
                            Total Clicks
                        </p>

                        <strong>
                            0
                        </strong>

                    </div>


                    <div className="stat-card">

                        <p>
                            Created
                        </p>

                        <strong>
                            Today
                        </strong>

                    </div>


                    <div className="stat-card">

                        <p>
                            Status
                        </p>

                        <strong>
                            Active
                        </strong>

                    </div>

                </div>


                <div className="analytics-chart">

                    <h2>
                        Click activity
                    </h2>

                    <div className="chart-placeholder">
                        No click data available yet.
                    </div>

                </div>

            </main>

        </div>
    );
}

export default Analytics;