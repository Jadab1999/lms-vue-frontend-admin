if (process.env.NODE_ENV === "development") {
    const CONSTANTS = {
        imageUrl: "",
        imageUrlFrontEnd: "",
        imageUrlS3: "",
        iconUrl: "",
        s3RootUrl: '',
        apiKey: "jbS1iEWRBb5YjVnUDbW3qhuOF3eIQ5qA",
        scriptTag: "",
        cryptoSecret: "",
        frontendUrl: "",
        logoUrl : ""
    };

    module.exports = CONSTANTS;
} else if (process.env.NODE_ENV === "production") {
    const CONSTANTS = {
        imageUrl: "https://console.truabilities.com/assets/dist/img/",
        imageUrlFrontEnd: "https://console.truabilities.com/frontend_assets/",
        iconUrl: "https://truabilities-prod.s3.us-west-1.amazonaws.com/application/assets/images/v2/",
        s3RootUrl: 'https://truabilities-prod.s3.us-west-1.amazonaws.com/',
        apiKey: "jbS1iEWRBb5YjVnUDbW3qhuOF3eIQ5qA",
        scriptTag: "<script type='text/javascript' async src='https://app.truabilities.com/release/truabilities.js?widgetkey=' crossorigin='anonymous'></script>",
        cryptoSecret: "yj0NNLzD0ZNYrTRgdzrIErkq1W13NvTF",
        frontendUrl: "https://truabilities.com/",
        logoUrl : "https://truabilities-dev.s3.us-west-1.amazonaws.com/portal/User%20Portal/logo-white.png?AWSAccessKeyId=AKIAZJ4VKLIYQDJKT4WU&Expires=1966098152&Signature=bwrORPnXzq0LHy6VMwuIUV8R%2FQg%3D"
    };

    module.exports = CONSTANTS;
}