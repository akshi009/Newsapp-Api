import PropTypes from "prop-types";
import React, { Component } from "react";
import Loader from "./Loader";
import NewItem from "./NewItem";

export default class News extends Component {
  static defultprops = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor() {
    super();
    this.state = {
      articles: [],
      filteredArticles: [],
      loading: false,
      searchQuery: "",
      page: 1,
    };
  }
  async updatenews() {
    this.props.setProgress(40);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1dbed1bb8165403c9d6b5bd360d2dcb6&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parseddata = await data.json();
    this.setState({
      articles: parseddata.articles,
      filteredArticles: parseddata.articles,
      totalResults: parseddata.totalResults,
      loading: false,
    });
    document.title = `Newsy-${this.capitalizeFirstLetter(this.props.category)}`;
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updatenews();
  }

  handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredArticles = this.state.articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery)
    );
    this.setState({ searchQuery, filteredArticles });
  };

  nextClick = async () => {
    this.setState({ page: this.state.page + 1 });
    this.updatenews();
  };

  prevClick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updatenews();
  };

  render() {
    return (
      <div>
        <h1 className="text-gray-800 mx-5 mt-10 lg:mt-10 mb-2 font-semibold text-center text-3xl lg:text-5xl">
          Top Headlines From{" "}
          <span className="text-blue-500">
            {" "}
            {this.capitalizeFirstLetter(this.props.category)} Category
          </span>{" "}
        </h1>

        <p className="lg:block hidden md:block text-gray-600 mx-5 mt-4 lg:mb-10 font-medium text-center text-2xl lg:text-2xl">
          Stay Informed, Stay Ahead
        </p>

        <div className="flex justify-center">
          <input
            className="form-control mx-2 mt-8 md:w-96 px-4 py-2 bg-gray-100 w-full rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Search"
            aria-label="Search"
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />
        </div>
        {this.state.loading ? <Loader className="mt-20" /> : null}
        <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-10 m-10">
          {!this.state.loading &&
            this.state.filteredArticles.map((ele) => (
              <NewItem
                key={ele.url}
                url={ele.url}
                title={ele.title}
                description={
                  ele.description ? ele.description.slice(0, 200) + "..." : ""
                }
                image={
                  ele.urlToImage ||
                  "https://wingandaprayerdotlive.files.wordpress.com/2017/07/no-image-available.jpg"
                }
                time={ele.publishedAt}
                author={ele.author}
                source={ele.source.name}
              />
            ))}
        </div>
        {!this.state.loading ? (
          <div className="flex justify-between">
            <button
              disabled={this.state.page <= 1}
              type="button"
              className="btn text-white bg-primary mx-10 mb-10"
              onClick={this.prevClick}
            >
              &larr; Previous
            </button>
            <button
              type="button"
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / this.props.pageSize)
              }
              className="btn text-white bg-primary mx-10 mb-10"
              onClick={this.nextClick}
            >
              Next &rarr;
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}
