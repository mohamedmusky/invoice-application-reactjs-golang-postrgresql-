import React from "react";
import { Grid, Button} from "@mui/material";
import "./Home.css";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="body">
      <Grid container sx={{ margin: "20px", marginRight: "20px" }}>
        <Grid item xs={10}>
          {" "}
          <div className="item">ABC PHARMACY</div>
        </Grid>

        <Grid item xs={2}>
          <div className="item0"></div>
        </Grid>
        <Grid item xs={1}>
          {" "}
          <div className="item1">
            <Link to="/item">
            <Button
              sx={{
                backgroundColor: "aqua",
                border: "black solid 1px",
                color: "black",
                height:"30px",
                width:"125px",
                
              }}
            >
              items
            </Button>
            </Link>
          </div>
        </Grid>
        <Grid item xs={1}>
          {" "}
          <div className="item2">
            <Link to="/invo">
                <Button
              sx={{
                backgroundColor: "aqua",
                border: "black solid 1px",
                color: "black",
                height:"30px",
                width:"125px"
              }}
            >
              customers
            </Button>
            </Link>
            

          </div>
        </Grid>
        <Grid item xs={1}>
          {" "}
          <div className="item2">
            <Link to="/invoices">
                <Button
              sx={{
                backgroundColor: "aqua",
                border: "black solid 1px",
                color: "black",
                height:"30px",
                width:"125px"
              }}
            >
              Invoices
            </Button>
            </Link>
            

          </div>
        </Grid>
        <Grid item xs={1}>
          {" "}
          <div className="item2">
            <Link to="/list">
                <Button
              sx={{
                backgroundColor: "aqua",
                border: "black solid 1px",
                color: "black",
                height:"30px",
                width:"125px"
              }}
            >
              Invoices list
            </Button>
            </Link>
            

          </div>
        </Grid>
        <Grid item xs={8}>
          {" "}
          <div className="item3"></div>
        </Grid>
        <Grid item xs={12}>
          {" "}
          <div className="item4">
            <h1>WELL COME</h1>
            <h2>
              Welcome to ABC Pharmacy, where your health and well-being are our
              top priorities
            </h2>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
