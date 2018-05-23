import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

class ContextMenu extends React.Component {
    state = {
        visible: false,
        selected: document.getElementsByClassName("col-selected")
    };
    
    componentDidMount() {
        document.addEventListener('contextmenu', this._handleContextMenu);
        document.addEventListener('click', this._handleClick);
        document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this._handleContextMenu);
        document.removeEventListener('click', this._handleClick);
        document.removeEventListener('scroll', this._handleScroll);
    }
    
    _handleContextMenu = (event) => {
        event.preventDefault();
        
        this.setState({ visible: true });
        
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;
        
        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
        
        if (right) {
            this.root.style.left = `${clickX + 5}px`;
        }
        
        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }
        
        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }
        
        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }
    };

    _handleClick = (event) => {
        const { visible } = this.state;
        const wasOutside = !(event.target.contains === this.root);
        if (wasOutside && visible && !document.getElementsByClassName('visible link item').length ) this.setState({ visible: false, });
    };

    _handleScroll = () => {
        const { visible } = this.state;
        
        if (visible) this.setState({ visible: false, });
    };

    _handleTextAlign = (align) => {
        for (let index = 0; index < this.state.selected.length; index++) {
            this.state.selected[index].style.textAlign=align
        }
    }
    
    render() {
        const { visible, selected } = this.state;
        
        return(visible || null) && 
            <div ref={ref => {this.root = ref}} className="contextMenu">
                <Dropdown text='Alignment' pointing='left' className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>this._handleTextAlign('left')} style={{textAlign:'left'}} >Left</Dropdown.Item>
                        <Dropdown.Item onClick={()=>this._handleTextAlign('center')} style={{textAlign:'center'}} >Center</Dropdown.Item>
                        <Dropdown.Item onClick={()=>this._handleTextAlign('right')} style={{textAlign:'right'}} >Right</Dropdown.Item>
                        <div className="contextMenu--separator" />
                        <Dropdown.Item>Help</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className="contextMenu--option contextMenu--option__disabled">View full version</div>
                <div className="contextMenu--option">Settings</div>
                <div className="contextMenu--separator" />
                <div className="contextMenu--option">About this app</div>
            </div>
    };
}
export default ContextMenu;