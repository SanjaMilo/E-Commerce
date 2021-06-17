import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords}) => {
    return(
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    )
};

Meta.defaultProps = {
    title: "Welcome To MasterShop",
    description: "We sell the best for cheap",
    keywords: "buy cheap, electronics, fashion, furniture"
};

export default Helmet;

