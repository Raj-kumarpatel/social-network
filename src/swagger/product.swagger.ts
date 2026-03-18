const ProductApiDocs = {
  "/product": {
    get: {
      summary: "fetch all products",
      parameters:[
         {
            in:"query",
            name:"page",
            default:1,
            schema:{type:"number"}
         },
         {
            in:"query",
            name:"limit",
            default:12,
            schema:{type:"number"}
         }
      ],
      responses: {
        200: {
          description: "Success",
          content:{
            "application/json":{
                schema:{
                    type:"array",
                    items:{
                        type:"object",
                        properties:{
                            _id:{type:"string"},
                            price:{type:"string"},
                            discount:{type:"string"},
                            title:{type:"string"},
                            tag:{type:"string"},
                        }
                    }
                }
            }
          }
        },
        500: {
          description: "Error",
        },
      },
    },
    post: {
      summary: "Add a new products",
      responses: {
        200: {
          description: "Success",
        },
        500: {
          description: "Error",
        },
      },
    },
  },

  "/product/{id}": {
    put: {
      summary: "update products",
      responses: {
        200: {
          description: "Success",
        },
        404: {
          description: "Not found",
        },
        500: {
          description: "Error",
        },
      },
    },
    delete: {
      summary: "delete products",
      responses: {
        200: {
          description: "Success",
        },
        404: {
          description: "Not found",
        },
        500: {
          description: "Error",
        },
      },
    },
  },
};
export default ProductApiDocs;
