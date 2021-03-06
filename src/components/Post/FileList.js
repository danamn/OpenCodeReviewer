import React,{Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import {Card,List,ListItem} from 'material-ui';

import config from '../../../config';
const api = config.api || '';

export default class FileList extends Component {
  constructor(props){
    super(props)
    this.state={
      files:this.props.files,
      path:[],
      highlightedFile:''
    }
  }

  openFolder(file){
    if(file.name==="home"){
      this.setState({files:this.props.files,path:[]})
    } else {
      axios.get(api+'/api/files/'+file._id)
        .then((res)=> {
          let path = this.state.path;
          if(!_.find(path,file)) {
            path.push(file);
          }
          this.setState({files: res.data.children, path: path})
        })
    }
  }

  openFile(file){
    axios.get(api+'/api/files/'+file._id)
      .then((res)=>{
        console.log('res.data in openFile: '+res.data)
        this.props.getFileContent(res.data)
      })
    this.setState({highLightedFile:file._id});
  }

  render(){
    return (
      <Card className="filesystem">
        <div className="filepath">
          <span onClick={this.openFolder.bind(this,{name:'home'})}>Home </span>
          {this.state.path.map((path)=>{
            return <span onClick={this.openFolder.bind(this,path)}>/ {path.name}</span>
          })}
        </div>
        <List className="listoffiles">
          {this.state.files.map((file)=>{
            if(file.is_folder){
              return <ListItem onClick={this.openFolder.bind(this,file)} className="file-item folder">
                <i className="fa fa-folder" aria-hidden="true"/>
                {file.name}
              </ListItem>
            } else {
              return <ListItem onClick={this.openFile.bind(this,file)} className="file-item file">
                <i className="fa fa-file-code-o" aria-hidden="true"/>
                <span className={file._id === this.state.highlightedFile ? 'highlightedFile' : null}>{file.name}</span>
              </ListItem>
            }
          })}
        </List>
      </Card>
    )
  }
}