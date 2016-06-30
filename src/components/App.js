
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import UploadZone from './UploadZone';

class App extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      token: 'TOKEN'
    };
  }
  onUpload(files) {
    let progresses = {};
    files.map((file) => {
      file.onprogress = (e) => {
        progresses[file.preview] = e.percent;
        console.log(e.percent);
        this.setState({progresses: progresses});
      }
    })
  }
  onDrop(files) {
    this.setState({
      files: files
    });
    console.log(files);
  }
  handleUpload(e) {
    if (this.state.files.length <= 0) {
      alert('you need add at least one file');
    }
    let pgbars = document.querySelectorAll('progress');
    console.log(pgbars);
    Array.prototype.map.call(pgbars, value => {
      let v = parseInt(value.value);
      if (v < 100) {
        var timeFunc = setInterval(() => {
          if (v < 100) {
            v += 1;
            value.value = v;
          } else {
            alert('file upload success');
            clearInterval(timeFunc);
          }
        }, 50)
      } else {
        clearInteval(timeFunc);
      }

    })
  }
  showFiles() {
    if (this.state.files.length <= 0) {
      return '';
    }
    let files = this.state.files;
    let progresses = this.state.progresses;
    let styles = {
      width: '400px',
      height: '300px',
      margin: '10px auto'
    };
    let filesArray = [];
    files.map((value, index) => {
      let preview = '';
      let progress = progresses && progresses[value.preview];
      if (/image/.test(value.type)) {
        preview = <img className='img-preview' src={value.preview} />;
      } else {
        preview = <div className='img-preview'> thie file type cant support preview </div>;
      }
      let progressbar = <progress ref='progressbar' value='0.0' max='100'>upload progress</progress>;
      filesArray.push(
        // <li key={index}>
        // {preview} {value.name + ':' + value.size/1000 + 'KB'}
        // {(progress || 0) + '% uploaded'} </li>
        <tr key={index}>
          <td> {preview} </td>
          <td> {value.name} </td>
          <td> {value.type} </td>
          <td> {Math.ceil(value.size/1024) + 'KB'} </td>
          <td> {progressbar} </td>
        </tr>
      );

    })
    return (
      <div className='show-files' style={styles}>
        <h3>uploaded files: </h3>
        <table className='tbl-preview'>
          <thead>
            <tr>
              <td> preview area </td>
              <td> file name </td>
              <td> file type </td>
              <td> file size </td>
              <td> progress bar </td>
            </tr>
          </thead>
          <tbody>
            {filesArray}
          </tbody>
        </table>
      </div>
    )
  }
  render() {
    let styles = {padding: 30};
    let zoneStyle = {
      margin: '20px auto',
      border: '2px dashed #ccc',
      borderRadius: '5px',
      width: '300px',
      height: '200px',
      color: '#aaa'
    };
    return (
      <div className='upload-files-area'>
        <UploadZone onDrop={this.onDrop.bind(this)}
          onUpload={this.onUpload.bind(this)}
          size={200} token={this.state.token} accept='image/*'
          style={zoneStyle} >
          <div style={styles}> Click or Drop files here to upload</div>
        </UploadZone>
        {this.showFiles()}
        <div className='button-upload'>
          <button onClick={this.handleUpload.bind(this)}>upload</button>
        </div>
      </div>
    );
  }
}

module.exports = App;
