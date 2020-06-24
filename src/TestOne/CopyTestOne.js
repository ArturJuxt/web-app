import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import Loader from "../Loader/Loader";
import Table from "./Components/Table/Table";
import ModeSelector from "./Components/ModeSelector/ModeSelector";
import TableSearch from "./Components/TableSearch/TableSearch";
import _ from "lodash";
import DetaliRowView from "./Components/DetaliRowView/DetaliRowView";

class TestOne extends Component {
  state = {
    isModeSelected: false,
    isLoading: false,
    data: [],
    serach: "",
    sort: "asc", // desc
    sortField: "id",
    row: null,
    currentPage: 0,
  };

  async fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      isLoading: false,
      data: _.orderBy(data, this.state.sortField, this.state.sort),
    });
  }

  onSort = (sortField) => {
    const clonedData = this.state.data.concat();
    const sort = this.state.sort === "asc" ? "desc" : "asc";
    const data = _.orderBy(clonedData, sortField, sort);
    this.setState({ data, sort, sortField });
  };

  modeSelectHandler = (url) => {
    this.setState({
      isModeSelected: true,
      isLoading: true,
    });
    this.fetchData(url);
  };

  onRowSelect = (row) => {
    this.setState({ row });
  };

  pageChangeHandler = ({ selected }) => {
    this.setState({ currentPage: selected });
  };

  searchHandler = (search) => {
    this.setState({ search, currentPage: 0 });
  };

  getFilteredData() {
    const { data, search } = this.state;
    if (!search) {
      return data;
    }
    return data.filter((item) => {
      return (
        item["firstName"].toLowerCase().includes(search.toLowerCase()) ||
        item["lastName"].toLowerCase().includes(search.toLowerCase()) ||
        item["email"].toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  render() {
    const pageSize = 50;
    if (!this.state.isModeSelected) {
      return (
        <div>
          <ModeSelector onSelect={this.modeSelectHandler} />
        </div>
      );
    }

    const filteredData = this.getFilteredData();
    const pageCount = Math.ceil(filteredData.length / pageSize);
    const displayData = _.chunk(filteredData, pageSize)[this.state.currentPage];

    return (
      <div className="container">
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <React.Fragment>
            <TableSearch onSearch={this.searchHandler} />
            <Table
              data={displayData}
              onSort={this.onSort}
              sort={this.state.sort}
              sortField={this.state.sortField}
              onRowSelect={this.onRowSelect}
            />
          </React.Fragment>
        )}
        {this.state.data.length > pageSize ? (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.pageChangeHandler}
            containerClassName={"pagination"}
            activeClassName={"active"}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previusClassName="page-item"
            nextClassName="page-item"
            previusLinkClassName="page-link"
            nextLinkClassName="page-link"
            forcePage={this.state.currentPage}
          />
        ) : null}
        {this.state.row ? <DetaliRowView person={this.state.row} /> : null}
      </div>
    );
  }
}

export default TestOne;
