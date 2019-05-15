import React from 'react';

import HomeBanner from '~/components/Home/HomeBanner'
import HomeService from '~/components/Home/HomeService'
import HomeCase from '~/components/Home/HomeCase'
import HomeAbout from '~/components/Home/HomeAbout'

export default function Home() {

  return(
    <div>

      <HomeBanner/>

      <HomeService/>

      <HomeCase/>

      <HomeAbout/>

    </div>
  )

}
