import React from 'react';

const Loader = () => {
    return(
        <div className="loader-wrapper">
            <img className="loader-gif" src={'/images/loader.gif'} alt="loader" />
            <p>Loading...</p>
        </div>
    )
}

export default Loader;