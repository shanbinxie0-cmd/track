import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, msg: '仅支持POST请求' });
  }

  try {
    const { billNo } = req.body;
    if (!billNo) {
      return res.status(400).json({ code: 400, msg: '请输入运单号' });
    }

    const BASE_URL = 'https://xsdfba.kingtrans.net/WebTrack';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': BASE_URL,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const { data } = await axios.post(BASE_URL, `billNo=${billNo}`, { headers });
    const $ = cheerio.load(data);
    const trackList = [];

    $('.track-node').each((_, el) => {
      const time = $(el).find('.time').text().trim();
      const content = $(el).find('.info').text().trim();
      if (time && content) trackList.push({ time, content });
    });

    return res.json({
      code: 200,
      msg: '查询成功',
      data: { billNo, trackList }
    });

  } catch (err) {
    return res.status(500).json({ code: 500, msg: '查询失败，请重试', error: err.message });
  }
}
