import React, { Component } from 'react'
import Pagination from '../common/pagination'
import ListGroup from '../common/listGroup'
import MoviesTable from '../components/moviesTable'
import {getMovies} from '../services/fakeMovieService'
import {getGenres} from '../services/fakeGenreService'
import {paginate} from '../utils/pagination'
import _ from 'lodash'
class Movies extends Component {
    state = { 
        movies: [],
        genres:[],
        pageSize: 4,
        selectedGenre: null,
        currentPage:1,
        sortColumn: {path: 'title', order : 'asc'}
    }

    componentDidMount(){
        const genres = [{_id : "", name: 'All Genres'},...getGenres()]
        this.setState({movies: getMovies(), genres})
    }

    handleDelete=(movie) => {
    const movies = this.state.movies.filter(m =>m._id !== movie._id)
     this.setState({movies})
    }

    handleLike = movie =>{
     const movies = [...this.state.movies]
     const index = movies.indexOf(movie)
     movies[index] = {...movies[index]}
     movies[index].liked =!movies[index].liked
     this.setState({movies})
    }

    handlePageChange = (page) => {
     this.setState({currentPage:page})
    }

    handleSort =(sortColumn) => {
   
      this.setState({sortColumn})
    }


    handleGenreSelect = (genre) =>{
    this.setState({selectedGenre: genre, currentPage :1})
    }

    render() {
        const {length: count} = this.state.movies
        const {pageSize,currentPage,movies,selectedGenre,sortColumn} =this.state
        if (count ===0)
        return <p>There are no movies in the database</p>;
        
        const filtered = selectedGenre && selectedGenre._id ? movies.filter(m => m.genre._id === selectedGenre._id) :movies
         
        const sorted = _.orderBy(filtered, [sortColumn.path],[sortColumn.order])

        const Movies = paginate(sorted,currentPage,pageSize)
        
         
        return(
            <div className= "row">
            <div className="col-3">
            <ListGroup
            items ={this.state.genres}
            selectedItem ={this.state.selectedGenre}
            onItemSelect ={this.handleGenreSelect}
            />
            </div>
            <div className="col">
            <p>There are {filtered.length} movies in the database</p>
            <MoviesTable
            sortColumn = {sortColumn}
            movies ={Movies} 
            onLike ={this.handleLike}
            onDelete = {this.handleDelete}
            onSort = {this.handleSort}
            />

            <Pagination 
            itemsCount ={filtered.length} 
            pageSize = {pageSize}
            currentPage ={currentPage}
            onPageChange ={this.handlePageChange}
            />
            </div>
            </div>
        )
    }
}

export default Movies;