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
    title: '风之大陆',
    desc: '于风而起，并肩前行！《风之大陆》是由紫龙游戏发行的首款异世界奇幻冒险手游。产品于2019年年初开启预注册，并于3月份在东南亚等国家和地区开启公测，公测当天吸引了数以万计的玩家疯狂涌入！',
    img: require('~/assets/home/case01.jpg')
  },
  {
    id: 'sticky02',
    title: '真三国大战',
    desc: '唯一一款真正三国RPG，以三国架构为游戏核心，攻略城池推动剧情发展为游戏目的，在RPG玩法上，更推陈出新增加 SLG 国战大地图模式。游戏中运用大量的排兵布阵技巧，完整具备了三国所有要素 武将+兵法+策略+资源产出+国战攻城 等完美结合。让你重回烽火连天的三国，胜负只在弹指一瞬间。',
    img: require('~/assets/home/case02.jpg')
  },
  {
    id: 'sticky03',
    title: '小影-VIVALIVE',
    desc: '原创视频、全能剪辑的短视频社区app。截止2018年年初，小影在全球范围内的激活用户已超过5亿，更在35个国家app store摄影与录像分类榜排名第一，在60个国家Google Play视频播放与编辑分类榜位列榜首，是国内唯一获得谷歌“顶尖开发者”称号的视频类App。',
    img: require('~/assets/home/case03.jpg')
  },
  {
    id: 'sticky04',
    title: 'Wecash-Tunaikita',
    desc: 'Tunaikita是一家隶属于Wecash的印尼金融企业。Wecash成立于2013年10月，基于B2B2C模式，一边连接用户一边服务金融机构。截至目前，Wecash已帮助超过80家金融机构完成了4000万用户的交易，在全球范围内获得1.6亿用户。',
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
