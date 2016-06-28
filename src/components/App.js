
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
        preview = <img src={value.preview} />;
      }
      filesArray.push(<li key={index}>
        {preview} {value.name + ':' + value.size/1000 + 'KB'} 
        {(progress || 0) + '% uploaded'} </li>
      );
    })
    return (
      <div className='show-files' style={styles}>
        <h3>uploaded files: </h3>
        <ul>
          {filesArray}
        </ul>
      </div>
    )
  }
  render() {
    return (
      <div className='upload-files-area'>
        <UploadZone onDrop={this.onDrop} onUpload={this.onUpload} 
          size={200} token={this.state.token}>
          <div> Click or Drop files here</div>
        </UploadZone>
        {this.showFiles()}
      </div>
    );
  }
}

module.exports = App;
