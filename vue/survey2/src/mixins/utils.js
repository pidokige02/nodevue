export const utils = { 
  methods: { 
    surveyStateName(s) {
      if(!s)
        return "준비중"
      else if (s==1)
        return "오픈"
      else if(s== 9)
        return "삭제"
      else 
        return "종료" 
    }
  } 
}