const MINT_URL = process.env.REACT_APP_GET_MINT_URL;

const GetMintedList = async (data) => {
    const url = MINT_URL;
  
    const submitRequest = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const json = await res.json();
        console.log(json)
        return { response: json, error: undefined };
      } catch (error) {
        return { response: undefined, error: error };
      }
    };
  
    return await submitRequest();
};
  
export default GetMintedList;
  