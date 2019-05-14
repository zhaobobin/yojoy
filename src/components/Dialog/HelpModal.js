import React from 'react';
import { Icon } from 'antd';
import { Modal, Toast } from 'antd-mobile';
import styles from './HelpModal.less'

export default class HelpModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = (msg) => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  render(){

    const {visible} = this.state;
    const {style, msg} = this.props;

    const iconStyle = style || {color: '#888'};

    return(
      <em>
        <Icon
          type="info"
          style={iconStyle}
          onClick={this.showModal}
        />
        <Modal
          className={styles.help}
          visible={visible}
          transparent={true}
          maskClosable={false}
          footer={false}
          onClose={this.hideModal}
        >
          <div className={styles.content}>
            <p>{msg}</p>
            <Icon type="close" className={styles.close} onClick={this.hideModal} />
          </div>
        </Modal>
      </em>
    )
  }

}
