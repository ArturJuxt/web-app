import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Loader from "../Loader/Loader";
import Table from "./Components/Table/Table";
import ModeSelector from "./Components/ModeSelector/ModeSelector";
import TableSearch from "./Components/TableSearch/TableSearch";
import _ from "lodash";
import DetaliRowView from "./Components/DetaliRowView/DetaliRowView";

const TestOne = () => {
  const [state, setState] = useState({
    isModeSelected: false,
    isLoading: false,
    data: [],
    serach: "",
    sort: "asc", // desc
    sortField: "id",
    row: null,
    currentPage: 0,
  });

  // async function fetchData(url) {
  //   const response = await fetch(url);
  //   const data = await response.json();

  //   setState((oldState) => {
  //     return ({
  //       ...oldState,
  //       isLoading: false,
  //       data: _.orderBy(data, oldState.sortField, oldState.sort),
  //     })
  //   });
  // }

  function fetchData(url) {
    fetch(url).then(
      (response) => {
        response.json().then((data) => {
          setState((oldState) => {
            return {
              ...oldState,
              isLoading: false,
              data: _.orderBy(data, oldState.sortField, oldState.sort),
            };
          });
        });
      },
      (response) => {
        // TODO: handle error
      }
    );
  }

  // Orinak hin tarberakov

  // const promise = new Promise(function (resolve, reject) {
  //   const success = false;
  //   setTimeout(() => {
  //     if (success) {
  //       resolve({ success: true, data: [1, 2, 3] });
  //     } else {
  //       reject({ sucess: false, error: "notfound" });
  //     }
  //   }, 5000);
  // });

  // promise.then(
  //   (data) => {
  //     console.log("data: [successs]", data);
  //   },
  //   (data) => {
  //     console.log("data: [error]", data);
  //   }
  // );

  const onSort = (sortField) => {
    const clonedData = state.data.concat();
    const sort = state.sort === "asc" ? "desc" : "asc";
    const data = _.orderBy(clonedData, sortField, sort);
    setState({ ...state, data, sort, sortField });
  };

  const modeSelectHandler = (url) => {
    setState({
      ...state,
      isModeSelected: true,
      isLoading: true,
    });
    fetchData(url);
  };

  const onRowSelect = (row) => {
    setState({ ...state, row });
  };

  const pageChangeHandler = ({ selected }) => {
    setState({ ...state, currentPage: selected });
  };

  const searchHandler = (search) => {
    setState({ ...state, search, currentPage: 0 });
  };

  const getFilteredData = () => {
    const { data, search } = state;
    console.log("state", state);

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
  };

  const pageSize = 50;

  if (!state.isModeSelected) {
    return (
      <div>
        <ModeSelector onSelect={modeSelectHandler} />
      </div>
    );
  }

  const filteredData = getFilteredData();
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const displayData = _.chunk(filteredData, pageSize)[state.currentPage];

  return (
    <div className="container">
      {state.isLoading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <TableSearch onSearch={searchHandler} />
          <Table
            data={displayData}
            onSort={onSort}
            sort={state.sort}
            sortField={state.sortField}
            onRowSelect={onRowSelect}
          />
        </React.Fragment>
      )}
      {state.data.length > pageSize ? (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={pageChangeHandler}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          forcePage={state.currentPage}
        />
      ) : null}
      {state.row ? <DetaliRowView person={state.row} /> : null}
    </div>
  );
};

export default TestOne;
