export const getData = async() => {
    const res = await fetch("http://localhost:9000/data")
    const data =await res.json() 
    return data[0];
}