<script setup>
import { ref, onMounted } from 'vue'
import { getParkInfoAPI } from '@/api/park';
import * as echarts from 'echarts'
// 拆分优化对比
/* 
1. 基于组件拆分
   1. 解决什么问题：复用 + 增加可维护性
   2. 拆分的是什么：.vue = HTML + JS + CSS
   3. 带来问题：一旦组件从一个变成了多个 必定形成嵌套关系 增加通信成本
2. 基于逻辑拆分
   1. 解决什么问题：复用(逻辑) + 增加可维护性
   2. 拆分的是什么: 拆分的只有js
   3. 带来的问题：对原生js函数的理解要求高了 
3. 基于逻辑的通用拆分思想
   1. 找到组件中属于同一个业务逻辑的所有代码（响应式数据 + 修改数据的方法）
   2. 定义一个以 `use` 打头的方法，把第一步所有的业务逻辑代码都放入
   3. 在use函数内部，把组件中要用到的数据或者方法以对象的方式导出
   4. 在组件的setup语法糖中，通过调用函数配合解构赋值把函数内部的数据和方法在组件中可用
*/

// 封装方法调用接口
const parkInfo = ref({})
const getParkInfo = async () => {
    const res = await getParkInfoAPI()
    // console.log(res);
    parkInfo.value = res.data
}
// 解决组件加载时首次渲染数据未请求到的问题 
// 1，使用v-if="Object.keys(parkInfo).length"
// 2，使用v-if="parkInfo.base && parkInfo.base.buildingTotal"可选链运算符
// 3，可选链运算符?. 运算符 前面有值再执行后面的运算 推荐
// 4，使用ref()包裹变量，实现响应式


onMounted( async() => {
    await getParkInfo() // 由于是异步的所以应该先让上一步执行后，下一步数据在调用
    initBarChart()
    initPieChart()
})

// echarts 相关: 
// 1，导入echarts包
// 2，获取要渲染的dom元素，准备好宽高，并且将其渲染到接买那种
// 3，将dom元素传入到echart.init()方法中，返回一个实例对象，然后调用实例对象的setOption()方法
// 4，准备渲染echarts的配置项
// 5，把配置项传给echarts实例
// 6，声明响应式数据

// 渲染柱状图
const barChart = ref(null)
const initBarChart = () => {
    const { parkIncome } = parkInfo.value
    const myCharts = echarts.init(barChart.value)
    const option = {
        tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      // 让图表占满容器
      top: '10px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
          show: false,
        },
        data: parkIncome.xMonth,
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '园区年度收入',
        type: 'bar',
        barWidth: '10px',
        data: parkIncome.yIncome.map((item, index) => {
          const color =
            index % 2 === 0
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0.23, color: '#74c0f8' },
                { offset: 1, color: 'rgba(116,192,248,0.00)' },
              ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0.23, color: '#ff7152' },
                { offset: 1, color: 'rgba(255,113,82,0.00)' },
              ])
          return { value: item, itemStyle: { color } }
        }),
      },
    ],
    textStyle: {
      color: '#B4C0CC',
    },
  }

  myCharts.setOption(option);
}

// 渲染饼状图
const pieChart = ref(null)
const initPieChart = () => {
  const { parkIndustry } = parkInfo.value
  const pieOption = {
    color: [
      '#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
    legend: {
      itemGap: 20,
      bottom: '0',
      icon: 'rect',
      itemHeight: 10, // 图例icon高度
      itemWidth: 10, // 图例icon宽度
      textStyle: {
        color: '#c6d1db',
      },
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '园区产业分析',
        type: 'pie',
        radius: ['55%', '60%'], // 设置内圈与外圈的半径使其呈现为环形
        center: ['50%', '40%'], // 圆心位置， 用于调整整个图的位置
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `${params.seriesName}</br><div style='display:flex;justify-content: space-between;'><div>${params.marker}${params.name}</div><div>${params.percent}%</div></div>`
          }
        },
        label: {
          show: false,
          position: 'center',
        },
        data: parkIndustry,
      },
    ],

  }
  const myPieChart = echarts.init(pieChart.value)
  myPieChart.setOption(pieOption)
}



</script>
<template>
    <div class="all-charts">
        <!-- 园区概况 -->
        <div class="section-one">
            <img class="img-header"
                src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E6%A6%82%E5%86%B5%402x.png"
                alt="" />
            <div class="icons-container">
                <div class="item">
                    <div class="icons-item building-icon">
                        <span class="number">
                            <!-- 可选链 ?. 运算符 前面有值再执行后面的运算 -->
                            {{parkInfo.base?.buildingTotal }}
                        </span>
                    </div>
                    <span class="title">楼宇总数</span>
                    <span class="unity">（栋）</span>
                </div>
                <div class="item">
                    <div class="icons-item enterprise-icon">
                        <span class="number">
                            {{ parkInfo.base && parkInfo.base.enterpriseTotal }}
                        </span>
                    </div>
                    <span class="title">入驻企业总数</span>
                    <span class="unity">（家）</span>
                </div>
                <div class="item">
                    <div class="icons-item car-icon">
                        <span class="number">
                            {{ parkInfo.base?.parkingTotal }}
                        </span>
                    </div>
                    <span class="title">车位总数</span>
                    <span class="unity">（个）</span>
                </div>
                <div class="item">
                    <div class="icons-item rod-icon">
                        <span class="number">
                            {{ parkInfo.base?.chargePoleTotal }}
                        </span>
                    </div>
                    <span class="title">一体杆总数</span>
                    <span class="unity">（个）</span>
                </div>
            </div>
        </div>
        <!-- 园区年度收入分析 -->
        <div class="section-two">
            <img class="img-header"
            src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E5%B9%B4%E5%BA%A6%E6%94%B6%E5%85%A5%E5%88%86%E6%9E%90%402x.png"
            alt="" />
            <div class="bar-chart-titile">
            <span>单位：元</span>
            <div>
                <span class="bar-icon blue-bar-icon"></span>
                <span class="bar-icon red-bar-icon"></span>
                收入情况
            </div>
            </div>
            <div class="bar-chart" ref="barChart"></div>
        </div>
        <!-- 园区产业分布 -->
        <div class="section-three">
            <img class="img-header"
                src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E4%BA%A7%E4%B8%9A%E5%88%86%E5%B8%83%402x.png"
                alt="" />
            <div class="pie-chart" ref="pieChart"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.all-charts {
    position: absolute;
    top: 0;
    left: 0;
    width: 480px;
    height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(to left, rgba(0, 6, 15, 0) 0%, rgba(0, 6, 15, 0.00) 20%, rgba(0, 0, 0, 0.40) 30%, rgba(0, 0, 0, 0.60) 40%, rgba(1, 4, 11, 1) 70%, #04070d 100%);

    .img-header {
        height: 30px;
    }
}

.section-one {
    flex-basis: 25%;

    .icons-container {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;

        .item {
            text-align: center;
            display: flex;
            flex-direction: column;
            flex: 1;

            .icons-item {
                height: 80px;
                position: relative;

                .number {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 18px;
                    font-family: FontquanXinYiGuanHeiTi, FontquanXinYiGuanHeiTi-Regular;
                    color: #ffffff;
                }
            }

            .building-icon {
                background: url('@/assets/building-icon.png') no-repeat 50% 0 / contain;
            }

            .enterprise-icon {
                background: url('@/assets/enterprise-icon.png') no-repeat 50% 0 / contain;
            }

            .rod-icon {
                background: url('@/assets/rod-icon.png') no-repeat 50% 0 / contain;
            }

            .car-icon {
                background: url('@/assets/car-icon.png') no-repeat 50% 0 / contain;
            }

            .title,
            .unity {
                font-size: 14px;
                color: #cdd7e1;
            }

            .title {
                margin-top: 8px;
            }
        }
    }
}

.section-two {
    flex-basis: 35%;
    .bar-chart {
      width: 100%;
      height: calc(100% - 90px);
    }
  }
  .section-three {
    flex-basis: 40%;

    .pie-chart {
      position: relative;
      margin: 0 auto;
      padding-bottom: 20px;
      width: 80%;
      height: calc(100% - 40px);
    }
  }
</style>