// API integration for Zhipu AI GLM-4.5-Flash

const API_KEY = "80658ca4664f49d99169f883a96ceaa2.vdlVJtCwbBAe9JUw";
const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

/**
 * Generate Bouquet Data by calling the Zhipu API.
 * @param {string[]} moods Array of selected mood labels
 * @param {string} style The selected style label
 * @returns {Promise<Object>} The structured JSON output of the bouquet
 */
async function generateBouquetData(moods, style) {
    const userPrompt = `用户当前的心情/场景是：${moods.join('、')}。选择的花艺风格是：${style}。请根据这些信息，生成一束花的设计。`;

    console.log("========== [DEBUG 模式输出] ==========");
    console.log("👉 给大模型的 Prompt:", userPrompt);
    console.time("⏱️  大模型请求耗时");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "glm-4.5-flash",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            console.error("API Call Failed", await response.text());
            throw new Error(`Network error: ${response.status}`);
        }

        const data = await response.json();
        console.timeEnd("⏱️  大模型请求耗时");
        console.log("🤖 大模型原始原始响应(Raw):", data);

        const content = data.choices[0].message.content;
        
        let parsedResult;
        try {
            const cleanStr = content.replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '');
            parsedResult = JSON.parse(cleanStr);
            console.log("✅ 成功解析 JSON 结构:", parsedResult);
            console.log("=====================================");
        } catch (e) {
            console.warn("Direct parsing failed, attempting raw output fallback.", e);
            parsedResult = JSON.parse(content);
        }

        return parsedResult;
    } catch (error) {
        console.error("生成花卉数据失败: ", error);
        return {
            title: "「星空守望」",
            poem: "这是在网络故障时为你送上的备用浪漫，只要心意在，花永远为你敞开。",
            materials: [
                { type: "主花", name: "未知花卉" },
                { type: "配花", name: "备选绿叶" },
                { type: "配叶", name: "无名小草" },
                { type: "包装", name: "自然封装与丝带" }
            ]
        };
    }
}
