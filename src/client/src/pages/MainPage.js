import "../styles/MainPage.css"

/*
Description:
- This page-component will render the MainPage, that will display a login form,
so that the user can create or join a whiteboard
*/

export const MainPage = ({handleSumbit}) => { 
  return (
      <div className="MainPage">
        <form action="" onSubmit={handleSumbit}>
          <div className="description">
            <h1>beste.Whiteboard</h1>
          </div>
          <div className="form-group">
            <input
              type="text"
	            name="token"
              className="form-control"
              placeholder="Enter the URL or Token here (for joining whiteboard)"
	      
            ></input>
          </div>
          <div className="form-group">
            <input
              type="text"
	            name="name"
              className="form-control"
              placeholder="Enter your name here"
              required
            ></input>
          </div>
          <div className="form-group">
            <input
              type="password"
	            name="pin"
              className="form-control"
              placeholder="Enter the PIN here"
              pattern="[0-9]{5}"
              maxLength="5"
              required
            ></input>
          </div>
	        <button className="btn" type='submit'>Submit</button>
        </form>
      </div>
    );
}