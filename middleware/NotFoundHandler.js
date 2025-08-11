import { NotFound } from "../utils/errors.js";


const notFoundHandler = () => {
    try {
        throw new NotFound('page not found'); 
    
      } catch (error) {
        next(error)
      }

}


export default notFoundHandler;

