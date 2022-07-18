import React from 'react'

export default function Header() {
  return (
    <head>
        @@include("./partials/title-meta.html", {"title": "Dashboard"})

        <!-- third party css -->
        <link href="assets/css/vendor/jquery-jvectormap-1.2.2.css" rel="stylesheet" type="text/css" />
        <!-- third party css end -->

        @@include('./partials/head-css.html')

    </head>

    @@include('./partials/body.html')
        <!-- Begin page -->
        <div class="wrapper">
            @@include('./partials/left-sidebar.html')
  )
}
