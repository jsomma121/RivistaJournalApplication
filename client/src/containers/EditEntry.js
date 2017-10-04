import React from 'react';
import {Link} from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';
import Octoicon from 'react-octicon';
import { invokeApig } from '../libs/awsLib';
import LoaderButton from "../components/LoaderButton";
import "./EditEntry.css";

export default class EditEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        editorState: EditorState.createEmpty(),
        content: ''
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
              
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  handleSubmit = async event => {
    event.preventDefault();
    
    try {
      const data = await this.createEntry({
        content: '',
        entryState: 'active',
        title: ''
      });
      console.log(data);
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }
  
  createEntry(entry) {
    return invokeApig({
      path: "/journal/entry",
      method: "POST",
      body: entry
    });
  }

  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';

    var contentState = editorState.getCurrentContent();
    console.log(contentState);
    
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (  
        <div>
            <h1 className="pageHeader">Entry Title: this is entry title</h1>
            <br/>
            <div>
            <h2>Content</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="RichEditor-root">
              <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
              />
              <div className={className} onClick={this.focus}>
                    <Editor
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        ref="editor"
                        spellCheck={true}
                    />
              </div>
              </div>
              <div className="buttons">
                <br/>
              <LoaderButton
                      type="submit"
                      isLoading={this.state.isLoading}
                      className="btn-primary"
                      text="Create Journal"
                      loadingText="Creating..."/>
              <button type="button" className="btn btn-secondary"  >Cancel</button>
              </div>
          </form>
          </div>
        </div>
      
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return ( 
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};