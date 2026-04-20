import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import MovieCard from './components/MovieCard';
import Search from './components/Search';
import Spinner from './components/Spinner';

//this is one wayy to create component
// function App(){}

//this is another way to create component
// const App = () => {}

//lets do the second way



//lesson 1 which is how to use components
// const Card  = ({title, rating, isCool, actors}) => {

//   return (
//     <div>
//       <h1>Card Component</h1>
//       <h2>{title}</h2>
//       <h2>{rating}</h2>
//       <h2>{isCool} {isCool ? "Cool" : "Not Cool"}</h2>
//       <p>{actors || "No actors"} </p>
//     </div>
//   )
// }

// const App = () => {
//   return (
//     <div>
//       <h1>App</h1>
//       <Card title="Avatar" rating = {5} isCool = {true} actors = {["John", "Jane"]}/>
//       <Card title="Lion King" rating = {5} isCool = {false}/>
//     </div>
//   )

// }


//lesson 2 how to style the components we can either make a index.css and import that
// or we can use inline styles with classnames to be more specifics to instead of all
// h2 tags being styled the same way we can use inline styles to style some differently
// we will be sticking to classnames from now on its more specific and you can just
// keep adding more styles to the same class of index.css
//as for states this is where we will use useState
//useState is a hook that allows you to add state to your component
// lets try a state for liked or not liked movies

//note that states start at their initial value every time we refresh the page
//so if we refresh the page the state will be false

// we did usestate lets do useeffect now to learn it
// const Card  = ({title, rating, isCool, actors}) => {

//   const [count, setCount]= useState(0);
//   const [hasLiked, setHasLiked] = useState(false);
//   useEffect(() => {
//     console.log(`${title} has been liked ${hasLiked}`);
//   }, [hasLiked]);

//   useEffect(() => {
//     console.log("CARD RENDERED");
//   }, []);

  

//   return (
//     <div className='card' onClick={()=> setCount(count + 1)}>
//       <h2>{title} <br /> {count || "No count"}</h2>
//       <h2>{rating}</h2>
//       <h2>{isCool} {isCool ? "Cool" : "Not Cool"}</h2>
//       <button onClick={() => setHasLiked(!hasLiked)}>
//         {hasLiked ?  '❤️': '🤍'}
//         </button>
//       <h2 >{actors || "No actors"} </h2>
//     </div>
//   )
// }

// const App = () => {
//   //this is a state which initiues to false
//   return (
//     <div >
//       <Card title="Avatar" rating = {5} isCool = {true} actors = {["John", "Jane"]}/>
//       <Card title="Lion King" rating = {5} isCool = {false}/>
//     </div>
//   )

// }

//props

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
// Add this lineconst App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //we can just do search term but this makes a stop to see if user stops typing for at least 500ms to then make an api call and serach the movies...
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

  try {
    const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint, API_OPTIONS);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response == 'False') {
      setErrorMessage(data.Error || "Error fetching movies. Please try again later.");
      setMovies([]);
      return;
    } 
      console.log("Data:", data);
      setMovies(data.results || []); // Get all movies!
    
  } catch(error) {
    console.log("Error fetching movies", error);
    setErrorMessage(data.error || "Error fetching movies. Please try again later.");
  } finally {
    setIsLoading(false);
  }
}


  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

    //this is a state which initiues to false

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
            <h1> Find <span className="text-gradient"> Movies </span> You'll Enjoy Without the Hassle! </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
              ): errorMessage?(
                <p className = "text-white">{errorMessage}</p>
              ):(
                <ul>
                  {movies.map((movie) => (

                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              )
            }
              
        </section>
      </div>

    </main>
  )
}


export default App

