const MINT_URL = process.env.REACT_APP_MINT_URL;

const PostMintReq = async (data) => {
    const url = MINT_URL;
  
    const submitRequest = async (reqBody) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        });
        const json = await res.json();
        return { response: json, error: undefined };
      } catch (error) {
        return { response: undefined, error: error };
      }
    };
  
    return await submitRequest(data);
  };
  
  export default PostMintReq;
  