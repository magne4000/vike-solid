export default onBeforeRender;

import fetch from "node-fetch";
//import { filterMovieData } from '../filterMovieData'
import type { Movie, MovieDetails } from "../types";

// export { prerender }

async function onBeforeRender() {
  const movies = await getStarWarsMovies();
  return {
    pageContext: {
      pageProps: {
        // We remove data we don't need because we pass `pageContext.movies` to
        // the client; we want to minimize what is sent over the network.
        movies: filterMoviesData(movies),
      },
      // The page's <title>
      title: getTitle(movies),
    },
  };
}

async function getStarWarsMovies(): Promise<MovieDetails[]> {
  const response = await fetch("https://star-wars.brillout.com/api/films.json");
  let movies: MovieDetails[] = ((await response.json()) as any).results;
  movies = movies.map((movie: MovieDetails, i: number) => ({
    ...movie,
    id: String(i + 1),
  }));
  return movies;
}

function filterMoviesData(movies: MovieDetails[]): Movie[] {
  return movies.map((movie: MovieDetails) => {
    const { title, release_date, id } = movie;
    return { title, release_date, id };
  });
}

/*
async function prerender() {
  const movies = await getStarWarsMovies()
  return [
    {
      url: '/star-wars',
      // We already provide `pageContext` here so that Solide
      // will *not* have to call the `onBeforeRender()` hook defined
      // above in this file.
      pageContext: {
        pageProps: {
          movies: filterMoviesData(movies)
        },
        title: getTitle(movies)
      }
    },
    ...movies.map((movie) => {
      const url = `/star-wars/${movie.id}`
      return {
        url,
        // Note that we can also provide the `pageContext` of other pages.
        // This means that Solide will not call any
        // `onBeforeRender()` hook and the Star Wars API will be called
        // only once (in this `prerender()` hook).
        pageContext: {
          pageProps: {
            movie: filterMovieData(movie)
          },
          title: movie.title
        }
      }
    })
  ]
}
*/

function getTitle(movies: Movie[] | MovieDetails[]): string {
  const title = `${movies.length} Star Wars Movies`;
  return title;
}
