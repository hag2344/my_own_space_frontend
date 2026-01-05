export const menuMetaData = {
  home: {
    path: "/",
    webTitle: "나만의 공간",
    title: "홈",
    subTitle: "my own space",
  },
  schedule: {
    path: "/schedule",
    title: "일정 관리",
    subTitle: "schedule management",
  },
  diary: {
    path: "/diary",
    title: "일기",
    subTitle: "diary",
  },
  mymemory: {
    path: "/mymemory",
    title: "내 추억",
    subTitle: "my memory",
  },
  bookreport: {
    path: "/bookreport",
    title: "독서 기록",
    subTitle: "reading records",
  },
  // mymovielist: {
  //   path: "/mymovielist",
  //   title: "나의 영화 목록",
  //   subTitle: "my movie list",
  // },
};

function headerText(metaData) {
  const headerData = [
    {
      path: metaData.home.path,
      title: metaData.home.webTitle,
      subTitle: metaData.home.subTitle,
    },
    {
      path: metaData.diary.path,
      title: metaData.diary.title,
      subTitle: metaData.diary.subTitle,
    },
    {
      path: metaData.schedule.path,
      title: metaData.schedule.title,
      subTitle: metaData.schedule.subTitle,
    },
    {
      path: metaData.mymemory.path,
      title: metaData.mymemory.title,
      subTitle: metaData.mymemory.subTitle,
    },
    {
      path: metaData.bookreport.path,
      title: metaData.bookreport.title,
      subTitle: metaData.bookreport.subTitle,
    },
    // {
    //   path: metaData.mymovielist.path,
    //   title: metaData.mymovielist.title,
    //   subTitle: metaData.mymovielist.subTitle,
    // },
  ];

  return headerData;
}

export const routeMeta = headerText(menuMetaData);
