import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { Container, Form, Card, CardTitle, CardText, CardBody, Row, Col, Input , Alert } from 'reactstrap';
import './App.css';


class App extends Component {


  constructor(props) {
    super(props);
    this.state = { alert: '' };
  }
  
  /** 
   * parse csv to json 
   * @param string csv
   * @return object 
  */

  csvToJSON = (csv) => {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.stringify(result); //JSON
  }


  /**
   * Read xlsx file and parse it to csv
   */
  handleChange = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {

      let file = document.getElementById("file").files[0];
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        /* Update state */
        console.log(this.csvToJSON(data));
        /* alert */
        this.setState({ alert: 'Show result in your console !!' });
      };
      reader.onerror = function () {
        alert('Unable to read ' + file.fileName);
      };
    }
  }


  /** 
   * parse csv to array  
   * @param string strData
   * @param string strDelimiter
   * @return object 
  */

  CSVToArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];
      if (
        strMatchedDelimiter.length &&
        (strMatchedDelimiter !== strDelimiter)
      ) {
        arrData.push([]);
      }

      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        var strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );
      } else {
        // We found a non-quoted value.
        var strMatchedValue = arrMatches[3];
      }
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
  }


  render() {
    return (
      <Container>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Card>
              <CardTitle>XLSX Converter :</CardTitle>
              <CardText>Convert xlsx from and to csv or array</CardText>
              <CardBody>
                <Form>
                  <Input type="file" name="file" id="file" accept=".csv,.xlsx" onChange={() => this.handleChange()} />
                  {(this.state.alert !== '') && <Alert color="primary">{this.state.alert}</Alert>}
                </Form>
              </CardBody> 
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }



}

export default App;
