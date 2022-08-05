import Title from "../../Shared/Title";

import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from "recharts";

function Home() {

    const data = [
        {
            name: "july",
            staked: 4000,
            stakers: 2400,
            amt: 2400
        },
        {
            name: "august",
            staked: 3000,
            stakers: 1398,
            amt: 2210
        },
        {
            name: "september",
            staked: 2000,
            stakers: 9800,
            amt: 2290
        },
    ];

    return (
            <div id="Home" >
                <div className="container">
                    <Title text="Accueil" />
                    <div className="main-page">
                        <div className="header-info">
                            <div className="box-info total-staked"><div className="title">Total staked</div><div className="value">1 453 023 01</div></div>
                            <div className="box-info apy-rate"><div className="title">APY Rate</div><div className="value">15%</div></div>
                            <div className="box-info stakers"><div className="title">Stakers</div><div className="value">3 023 01</div></div>
                        </div>
                        <div className="general-details">
                            <h2>Staking data</h2>
                            <div className="general-details-graphics" >
                                <LineChart
                                    width={1000}
                                    height={300}
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="staked" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="stakers" stroke="#82ca9d" />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Home;
