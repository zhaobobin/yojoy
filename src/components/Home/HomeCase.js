/**
 * 成功案例
 * sticky css3动画
 */
import React from 'react';
import { Row, Col } from 'antd'
import styles from './HomeCase.less'

const list = [
  {
    id: 'sticky01',
    title: '紫龙-风之大陆',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case01.jpg')
  },
  {
    id: 'sticky02',
    title: '小影app',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case02.jpg')
  },
  {
    id: 'sticky03',
    title: '扫描全能王app',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case03.jpg')
  },
  {
    id: 'sticky04',
    title: '火溶-真三国大战',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case04.jpg')
  }
];

export default class HomeCase extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      current: '',
      style: [
        '',
        '',
        '',
        '',
      ],
    }
  }

  componentDidMount(){
    setTimeout(() => {
      window.addEventListener('scroll', this.onScroll);
    }, 500)
  }

  onScroll = () => {
    let {style} = this.state;
    const sticky01Top = document.getElementById('sticky01').getBoundingClientRect().top;
    const sticky02Top = document.getElementById('sticky02').getBoundingClientRect().top;
    const sticky03Top = document.getElementById('sticky03').getBoundingClientRect().top;
    const sticky04Top = document.getElementById('sticky04').getBoundingClientRect().top;

    // sticky01
    if(sticky02Top > 600){
      style[0] = ''
    }
    else if(sticky02Top > 120 && sticky02Top < 600){
      style[0] = styles.opacity
    }
    else{
      style[0] = styles.hide
    }

    // sticky02
    if(sticky03Top > 600){
      style[1] = ''
    }
    else if(sticky03Top > 120 && sticky03Top < 600){
      style[1] = styles.opacity
    }
    else{
      style[1] = styles.hide
    }

    // sticky03
    if(sticky04Top > 600){
      style[2] = ''
    }
    else if(sticky04Top > 120 && sticky04Top < 600){
      style[2] = styles.opacity
    }
    else{
      style[2] = styles.hide
    }

    this.setState({style})
  };

  render(){

    const { current, style } = this.state;

    return(
      <div className={styles.container} id="case">

        <Row>

          <Col xs={1} sm={2} md={5} lg={5}/>

          <Col xs={22} sm={20} md={14} lg={14}>

            <div className={styles.con}>
              <h2>经典案例</h2>

              <div className={styles.list}>
                <ul>
                  {
                    list.map((item, index) => (
                      <li
                        key={index}
                        className={styles.item + " " + style[index]}
                        id={item.id}
                      >
                        <div className={styles.box}>
                          <h3 className={styles.title}>{item.title}</h3>
                          <p className={styles.desc}>{item.desc}</p>
                          <img src={item.img} alt="img"/>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>

            </div>

          </Col>

          <Col xs={1} sm={2} md={5} lg={5}/>

        </Row>

      </div>
    )

  }

}
