import React from 'react';
import Nav from './Navbar.js'
import './stats.css';
const Stats = () => {
    return (
        <div className="stats">

            <Nav />
            <div className="main">
                <h3>Statistics</h3>
                <hr />
                <div className="statstop">

                    <div className="element"></div>
                    <div className="element"></div>
                    <div className="element"></div>


                </div>

                <div className="statsbottom">
                    <div className="sales"></div>
                    <div className="products"></div>
                </div>
            </div>
        </div>
    )
}
export default Stats;