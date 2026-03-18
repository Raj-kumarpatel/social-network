import ProductApiDocs from "../swagger/product.swagger"

const SwaggerConfig = {
    openapi:"3.0.0",
    info:{
        title:"social-network",
        description:"All the public and private apis here..",
        version:"1.0.0",
        contact:{
            name:"Raj kumar",
            email:"patelrajkumar207@gmail.com"
        }
    },
    servers: [
        {
            url:process.env.SERVER
        }
    ],
    paths:{
        ...ProductApiDocs
    }

}

export default SwaggerConfig