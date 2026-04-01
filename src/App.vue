<template>
  <div class="app-container">
    <div class="search-card">
      <h1>物流轨迹查询</h1>
      <div class="search-group">
        <el-input 
          v-model="billNo" 
          placeholder="请输入运单号" 
          clearable 
          @keyup.enter="handleQuery"
        />
        <el-button type="primary" @click="handleQuery" :loading="loading">
          立即查询
        </el-button>
      </div>
    </div>

    <div class="result" v-if="resultData">
      <el-card shadow="hover">
        <div class="bill-title">运单号：{{ resultData.billNo }}</div>
        <el-timeline>
          <el-timeline-item 
            v-for="(item, index) in resultData.trackList" 
            :key="index"
            :timestamp="item.time"
          >
            {{ item.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <el-empty 
      v-if="!loading && billNo && !resultData?.trackList.length" 
      description="暂无物流信息" 
      class="empty-box"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const billNo = ref('');
const loading = ref(false);
const resultData = ref(null);

const handleQuery = async () => {
  if (!billNo.value.trim()) {
    ElMessage.warning('请输入运单号');
    return;
  }
  
  loading.value = true;
  resultData.value = null;
  
  try {
    const res = await axios.post('/api/track', { billNo: billNo.value });
    if (res.data.code === 200) {
      resultData.value = res.data.data;
      ElMessage.success('查询成功');
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    ElMessage.error('服务异常，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 80px auto;
  padding: 0 20px;
}
.search-card {
  text-align: center;
  margin-bottom: 40px;
}
.search-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.bill-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}
.empty-box {
  margin-top: 60px;
}
</style>
