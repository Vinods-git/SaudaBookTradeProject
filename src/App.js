import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import React, { useState, useRef, useEffect } from 'react';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Card, Button } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';
import axios from 'axios';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const App = () => {

  const [image, setImage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputFile = useRef(null);


  const useStyles = makeStyles({
    table: {
      minWidth: 650
    }
  });

  const classes = useStyles();

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  useEffect(async () => {
    axios.get('https://api.sampleapis.com/futurama/characters').then(res => {
      setCharacters(res.data);
      setLoading(false);
      console.log(loading);
      console.log(characters);
    });
  }, [loading]);
  const renderFile = fileObj => {
    //just pass the fileObj as parameter
    // console.log(fileObj.name);

    ExcelRenderer(fileObj, (err, resp) => {
      // console.log(resp.cols, resp.rows);

      if (err) {
        console.log(err);
      } else {
        setDataLoaded(true);
        setCols(resp.cols);
        setRows(resp.rows);
        console.log(cols, rows);
      }
    });
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    // console.log(inputFile);
    inputFile.current.click();
  };
  const handleFileUpload = event => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      // console.log(fileObj);

      let fileName = fileObj.name;
      // console.log(event.target.files[0].name);

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf('.') + 1) === 'xlsx') {
        setUploadedFileName(fileName);
        setIsFormInvalid(false);
        renderFile(fileObj);
      } else {
        setIsFormInvalid(true);
        setUploadedFileName(fileName);
      }
    }
  };

  // console.log('imageimage', image);
  return (
    <div>
      <div
        className = 'upload-box'
      >
        <input
          // value={uploadedFileName}
          // style={{ display: 'none' }}
          ref={inputFile}
          onChange={handleFileUpload}
          type="file"
        />
      </div>
      {/*
 <div className="button" onClick={onButtonClick}>
        Upload
      </div> */}
      {dataLoaded && (
        <div>
          <Card body outline color="secondary" className="restrict-card">
            <OutTable
              data={rows}
              columns={cols}
              tableClassName="ExcelTable2007"
              tableHeaderRowClass="heading"
            />
          </Card>
        </div>
      )}
      {loading ? (
        <div>Loading</div>
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Gender</StyledTableCell>
                <StyledTableCell align="center">Species</StyledTableCell>
                <StyledTableCell align="center">Home Planet</StyledTableCell>
                <StyledTableCell align="center">Occupation</StyledTableCell>
                <StyledTableCell align="center">Age</StyledTableCell>
                <StyledTableCell align="center">Sayings</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {characters.map(char => (
                <TableRow key={char.id}>
                  <StyledTableCell component="th" scope="row">
                    {char.id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <img
                      style={{ width: 30 }}
                      src={char.images?.main}
                    />
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {char.name?.first} {char.name?.last}
                  </StyledTableCell>
                  <StyledTableCell align="center">{char.gender}</StyledTableCell>
                  <StyledTableCell align="center">{char.species}</StyledTableCell>
                  <StyledTableCell align="center">{char.homePlanet}</StyledTableCell>
                  <StyledTableCell align="center">{char.occupation}</StyledTableCell>
                  <StyledTableCell align="center">{char.age}</StyledTableCell>
                  <StyledTableCell align="center"><ol>{char.sayings?.map(s=><li>{s}</li>)}</ol></StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        // <List component="nav">
        //   {characters.map(char => (
        //     <ListItem key={char.id} button>
        //       <span>{char.id}</span>
        //       <img src={char.images?.main} />
        //       {char.name?.first}{' '}
        //       {char.name?.last}
        //     </ListItem>
        //   ))}
        // </List> <TableContainer component={Paper}>
      )}
    </div>
  );
};

export default App;
//      occupation sayings age __typename
