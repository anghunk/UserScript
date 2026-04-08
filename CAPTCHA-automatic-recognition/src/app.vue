<template>
  <div class="captcha-recognition-container">
    <!-- 开发环境设置按钮 -->
    <div
      v-if="process.env.NODE_ENV === 'development' && !showSettings"
      class="dev-settings-button"
      @click="openSettings"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path
          fill="currentColor"
          d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
        />
      </svg>
    </div>

    <!-- 设置弹窗 -->
    <div
      v-if="showSettings"
      class="captcha-settings-overlay"
      @click="closeSettings"
    ></div>
    <div
      v-if="showSettings"
      class="captcha-settings-modal"
      :class="{ show: showSettings }"
      @click.stop
    >
      <div class="captcha-settings-content">
        <h3>
          验证码识别设置 <span>{{ packageJson.version }}</span>
        </h3>

        <!-- 设置导航栏 -->
        <div class="settings-nav">
          <div
            class="settings-nav-item"
            :class="{ active: activeSettingTab === 'ai' }"
            @click="activeSettingTab = 'ai'"
          >
            AI 服务商
          </div>
          <div
            class="settings-nav-item"
            :class="{ active: activeSettingTab === 'function' }"
            @click="activeSettingTab = 'function'"
          >
            功能设置
          </div>
          <div
            class="settings-nav-item"
            :class="{ active: activeSettingTab === 'domain' }"
            @click="activeSettingTab = 'domain'"
          >
            禁用域名
          </div>
          <div
            class="settings-nav-item"
            :class="{ active: activeSettingTab === 'advanced' }"
            @click="activeSettingTab = 'advanced'"
          >
            高级设置
          </div>
        </div>

        <!-- 设置内容区域 -->
        <div class="settings-content">
          <!-- AI 模型设置 -->
          <div v-if="activeSettingTab === 'ai'" class="settings-content-tab">
            <div class="settings-card">
              <div class="settings-card-title">
                <span>AI 服务商设置</span>
                <span class="api-type">{{ getApiTypeName(settings.apiType) }}</span>
              </div>

              <div class="captcha-settings-item">
                <label>API 类型：</label>
                <select v-model="settings.apiType">
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="qwen">阿里云通义千问</option>
                </select>
              </div>

              <div v-if="settings.apiType === 'openai'">
                <div class="captcha-settings-item">
                  <label>OpenAI API Key:</label>
                  <div class="input-with-button">
                    <input
                      type="text"
                      v-model="settings.openaiKey"
                      placeholder="sk-..."
                    />
                    <button
                      type="button"
                      class="test-api-button"
                      :class="{
                        'test-loading': apiTestStatus.openai === 'loading',
                        'test-success': apiTestStatus.openai === 'success',
                        'test-error': apiTestStatus.openai === 'error',
                      }"
                      @click="testApiConnection('openai')"
                    >
                      <span v-if="apiTestStatus.openai === ''">测试连接</span>
                      <span v-else-if="apiTestStatus.openai === 'loading'"></span>
                      <span v-else-if="apiTestStatus.openai === 'success'">成功</span>
                      <span v-else-if="apiTestStatus.openai === 'error'">失败</span>
                    </button>
                  </div>
                </div>
                <div class="captcha-settings-item">
                  <label>自定义 API 地址 (可选):</label>
                  <input
                    type="text"
                    v-model="settings.openaiApiUrl"
                    placeholder="https://api.openai.com/v1/chat/completions"
                  />
                  <small>留空使用默认地址</small>
                </div>
                <div class="captcha-settings-item">
                  <label>模型 (可选):</label>
                  <input
                    type="text"
                    v-model="settings.openaiModel"
                    placeholder="gpt-4.1-mini"
                  />
                  <small>留空使用默认模型</small>
                </div>
                <div class="captcha-settings-item">
                  <label>自定义提示词 (可选):</label>
                  <div class="textarea-with-button">
                    <textarea
                      v-model="settings.openaiPrompt"
                      placeholder="输入自定义提示词，或点击右侧按钮使用默认提示词"
                      rows="3"
                    ></textarea>
                    <button
                      type="button"
                      class="use-default-prompt"
                      @click="settings.openaiPrompt = DEFAULT_PROMPT"
                    >
                      使用默认
                    </button>
                  </div>
                  <small>留空使用默认提示词</small>
                </div>
              </div>

              <div v-if="settings.apiType === 'gemini'">
                <div class="captcha-settings-item">
                  <label>Google Gemini API Key:</label>
                  <div class="input-with-button">
                    <input
                      type="text"
                      v-model="settings.geminiKey"
                      placeholder="输入Gemini API Key"
                    />
                    <button
                      type="button"
                      class="test-api-button"
                      :class="{
                        'test-loading': apiTestStatus.gemini === 'loading',
                        'test-success': apiTestStatus.gemini === 'success',
                        'test-error': apiTestStatus.gemini === 'error',
                      }"
                      @click="testApiConnection('gemini')"
                    >
                      <span v-if="apiTestStatus.gemini === ''">测试连接</span>
                      <span v-else-if="apiTestStatus.gemini === 'loading'"></span>
                      <span v-else-if="apiTestStatus.gemini === 'success'">成功</span>
                      <span v-else-if="apiTestStatus.gemini === 'error'">失败</span>
                    </button>
                  </div>
                </div>
                <div class="captcha-settings-item">
                  <label>自定义 API 地址 (可选):</label>
                  <input
                    type="text"
                    v-model="settings.geminiApiUrl"
                    placeholder="https://generativelanguage.googleapis.com/v1beta/models"
                  />
                  <small>留空使用默认地址</small>
                </div>
                <div class="captcha-settings-item">
                  <label>模型 (可选):</label>
                  <input
                    type="text"
                    v-model="settings.geminiModel"
                    placeholder="gemini-2.5-flash-lite"
                  />
                  <small>留空使用默认模型</small>
                </div>
                <div class="captcha-settings-item">
                  <label>自定义提示词 (可选):</label>
                  <div class="textarea-with-button">
                    <textarea
                      v-model="settings.geminiPrompt"
                      placeholder="输入自定义提示词，或点击右侧按钮使用默认提示词"
                      rows="3"
                    ></textarea>
                    <button
                      type="button"
                      class="use-default-prompt"
                      @click="settings.geminiPrompt = DEFAULT_PROMPT"
                    >
                      使用默认
                    </button>
                  </div>
                  <small>留空使用默认提示词</small>
                </div>
              </div>

              <div v-if="settings.apiType === 'qwen'">
                <div class="captcha-settings-item">
                  <label>阿里云通义千问 API Key:</label>
                  <div class="input-with-button">
                    <input type="text" v-model="settings.qwenKey" placeholder="API Key" />
                    <button
                      type="button"
                      class="test-api-button"
                      :class="{
                        'test-loading': apiTestStatus.qwen === 'loading',
                        'test-success': apiTestStatus.qwen === 'success',
                        'test-error': apiTestStatus.qwen === 'error',
                      }"
                      @click="testApiConnection('qwen')"
                    >
                      <span v-if="apiTestStatus.qwen === ''">测试连接</span>
                      <span v-else-if="apiTestStatus.qwen === 'loading'"></span>
                      <span v-else-if="apiTestStatus.qwen === 'success'">成功</span>
                      <span v-else-if="apiTestStatus.qwen === 'error'">失败</span>
                    </button>
                  </div>
                </div>
                <div class="captcha-settings-item">
                  <label>自定义 API 地址 (可选):</label>
                  <input
                    type="text"
                    v-model="settings.qwenApiUrl"
                    placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
                  />
                  <small>留空使用默认地址</small>
                </div>
                <div class="captcha-settings-item">
                  <label>模型 (可选):</label>
                  <input
                    type="text"
                    v-model="settings.qwenModel"
                    placeholder="qwen-vl-max-2025-04-02"
                  />
                  <small>留空使用默认模型</small>
                </div>
                <div class="captcha-settings-item">
                  <label>自定义提示词 (可选):</label>
                  <div class="textarea-with-button">
                    <textarea
                      v-model="settings.qwenPrompt"
                      placeholder="输入自定义提示词，或点击右侧按钮使用默认提示词"
                      rows="3"
                    ></textarea>
                    <button
                      type="button"
                      class="use-default-prompt"
                      @click="settings.qwenPrompt = DEFAULT_PROMPT"
                    >
                      使用默认
                    </button>
                  </div>
                  <small>留空使用默认提示词</small>
                </div>
              </div>
            </div>
          </div>

          <!-- 功能设置 -->
          <div v-if="activeSettingTab === 'function'" class="settings-content-tab">
            <div class="settings-card">
              <div class="settings-card-title">
                <span>功能设置</span>
              </div>

              <div class="captcha-settings-item">
                <div style="display: flex; align-items: center">
                  <input
                    type="checkbox"
                    v-model="settings.autoRecognize"
                    id="autoRecognize"
                    style="width: auto; margin-right: 8px !important"
                  />
                  <label for="autoRecognize" style="margin-bottom: 0"
                    >验证码图片变化时自动识别</label
                  >
                </div>
              </div>

              <div class="captcha-settings-item">
                <div style="display: flex; align-items: center">
                  <input
                    type="checkbox"
                    v-model="settings.copyToClipboard"
                    id="copyToClipboard"
                    style="width: auto; margin-right: 8px !important"
                  />
                  <label for="copyToClipboard" style="margin-bottom: 0"
                    >自动复制到剪贴板</label
                  >
                </div>
              </div>

              <div class="captcha-settings-item">
                <div style="display: flex; align-items: center">
                  <input
                    type="checkbox"
                    v-model="settings.showNotification"
                    id="showNotification"
                    style="width: auto; margin-right: 8px !important"
                  />
                  <label for="showNotification" style="margin-bottom: 0"
                    >显示右上角通知提示</label
                  >
                </div>
              </div>

              <div class="captcha-settings-item">
                <div style="display: flex; align-items: center">
                  <input
                    type="checkbox"
                    v-model="settings.autoFetchCloudRules"
                    id="autoFetchCloudRules"
                    style="width: auto; margin-right: 8px !important"
                  />
                  <label for="autoFetchCloudRules" style="margin-bottom: 0"
                    >每日首次运行时自动获取云端规则</label
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 禁用域名列表 -->
          <div v-if="activeSettingTab === 'domain'" class="settings-content-tab">
            <div class="settings-card">
              <div class="settings-card-title">
                <span>禁用域名列表</span>
              </div>

              <div class="captcha-settings-item">
                <textarea
                  v-model="settings.disabledDomains"
                  placeholder="每行一个域名，支持正则和通配符，例如：
example.com
*.example.org
example.*.com
/^(www\.)?example\.com$/"
                  rows="6"
                  class="domain-textarea"
                ></textarea>
                <small>
                  在这些域名下将不启用验证码识别功能
                  <br />
                  多个配置请使用换行显示
                </small>
              </div>
            </div>
          </div>

          <!-- 高级设置 -->
          <div v-if="activeSettingTab === 'advanced'" class="settings-content-tab">
            <div class="settings-card">
              <div class="settings-card-title">
                <span
                  >高级设置
                  <a
                    href="https://github.com/anghunk/UserScript/tree/main/CAPTCHA-automatic-recognition/docs/advanced-settings.md"
                    target="_blank"
                    class="tutorial-link"
                    >教程</a
                  >
                </span>
              </div>

              <div class="advanced-settings-warning">
                ⚠️ 警告：如果您不了解 CSS 选择器，请不要修改这些设置，可能导致识别功能失效
              </div>

              <div class="captcha-settings-item">
                <label>自定义验证码图片选择器：</label>
                <div class="custom-selectors">
                  <div
                    v-for="(selector, index) in settings.customCaptchaSelectors"
                    :key="'captcha-' + index"
                    class="selector-item"
                  >
                    <input
                      type="text"
                      v-model="settings.customCaptchaSelectors[index]"
                      placeholder="例如: img[src*='captcha']"
                    />
                    <button
                      type="button"
                      class="remove-selector"
                      @click="removeSelector('captcha', index)"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-selector"
                    @click="addSelector('captcha')"
                  >
                    添加选择器
                  </button>
                </div>
              </div>

              <div class="captcha-settings-item">
                <label>自定义输入框选择器：</label>
                <div class="custom-selectors">
                  <div
                    v-for="(selector, index) in settings.customInputSelectors"
                    :key="'input-' + index"
                    class="selector-item"
                  >
                    <input
                      type="text"
                      v-model="settings.customInputSelectors[index]"
                      placeholder="例如: input[name*='captcha']"
                    />
                    <button
                      type="button"
                      class="remove-selector"
                      @click="removeSelector('input', index)"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-selector"
                    @click="addSelector('input')"
                  >
                    添加选择器
                  </button>
                </div>
              </div>

              <div class="captcha-settings-item">
                <label>验证码规则管理：</label>
                <div class="rules-management">
                  <div class="rules-url-input">
                    <input
                      type="text"
                      v-model="settings.rulesUrl"
                      placeholder="https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json"
                    />
                    <small
                      >规则文件 URL，留空则使用默认
                      URL：https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json</small
                    >
                  </div>
                  <button
                    type="button"
                    class="reload-rules-button"
                    :class="{
                      'test-loading': rulesLoadStatus === 'loading',
                      'test-success': rulesLoadStatus === 'success',
                      'test-error': rulesLoadStatus === 'error',
                    }"
                    @click="reloadRules"
                  >
                    <span v-if="rulesLoadStatus === ''">重新加载规则</span>
                    <span v-else-if="rulesLoadStatus === 'loading'"></span>
                    <span v-else-if="rulesLoadStatus === 'success'">加载成功</span>
                    <span v-else-if="rulesLoadStatus === 'error'">加载失败</span>
                  </button>
                  <small>从远程加载最新的验证码识别规则</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="captcha-settings-buttons">
          <button @click="saveSettings">保存设置</button>
          <button @click="closeSettings">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import packageJson from "../package.json";
import axios from "axios";
import { DEFAULT_PROMPT } from "./assets/prompts.js";

export default {
  data() {
    return {
      packageJson: packageJson,
      // 导入的常量
      DEFAULT_PROMPT,
      // API 测试状态
      apiTestStatus: {
        openai: "", // 可能的值：'', 'loading', 'success', 'error'
        gemini: "", // 可能的值：'', 'loading', 'success', 'error'
        qwen: "", // 可能的值：'', 'loading', 'success', 'error'
      },
      // 验证码规则配置
      rules: [],
      // 规则加载状态
      rulesLoadStatus: "", // 可能的值：'', 'loading', 'success', 'error'
      // 设置项
      settings: {
        apiType: "openai", // openai, gemini, qwen
        // OpenAI 设置
        openaiKey: "",
        openaiApiUrl: "",
        openaiModel: "",
        openaiPrompt: DEFAULT_PROMPT, // 自定义提示词，默认填充
        // Gemini 设置
        geminiKey: "",
        geminiApiUrl: "",
        geminiModel: "",
        geminiPrompt: DEFAULT_PROMPT, // 自定义提示词，默认填充
        // 通义千问设置
        qwenKey: "",
        qwenApiUrl: "",
        qwenModel: "",
        qwenPrompt: DEFAULT_PROMPT, // 自定义提示词，默认填充
        // 自动识别设置
        autoRecognize: false, // 是否启用自动识别
        // 剪贴板设置
        copyToClipboard: true, // 是否自动复制到剪贴板
        // 通知设置
        showNotification: true, // 是否显示右上角通知，默认开启
        // 云端规则设置
        autoFetchCloudRules: false, // 是否每日首次运行时自动获取云端规则，默认关闭
        // 自定义选择器
        customCaptchaSelectors: [],
        customInputSelectors: [],
        // 禁用域名列表
        disabledDomains: "", // 不启用验证码功能的网站域名列表，支持正则和通配符
        // 规则 URL
        rulesUrl:
          "https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json", // 规则文件 URL
      },
      // 是否显示设置面板
      showSettings: false,
      // 当前激活的设置标签页
      activeSettingTab: "ai",
      // 配置选项
      config: {
        // 验证码图片选择器
        captchaSelectors: [
          'img[src*="captcha"]',
          'img[src*="verify"]',
          'img[alt*="验证码"]',
          'img[title*="验证码"]',
          'img[alt*="captcha"]',
          'img[id="captchaPic"]',
          ".validate-code img",
          'img[style="z-index: 2; position: absolute; bottom: -11px; left: 206px; width: 88px; height: 40px;"]',
          '.authcode img[id="authImage"]',
          'img[class="verification-img"]',
          'img[name="imgCaptcha"]',
        ],
        // 相关输入框选择器 (通常在验证码图片附近的输入框)
        inputSelectors: [
          'input[name*="captcha"]',
          'input[name*="verify"]',
          'input[placeholder="请输入图片验证码"]',
          'input[id="authcode"]',
          'input[placeholder*="captcha"]',
          'input[placeholder*="验证码"]:not([placeholder*="短信"])',
        ],
      },
      // 用于在模板中访问环境变量
      process: {
        env: {
          NODE_ENV: process.env.NODE_ENV || "development",
        },
      },
    };
  },
  methods: {
    /**
     * 获取 API 类型名称
     * @param {string} apiType - API 类型
     * @returns {string} - 名称
     */
    getApiTypeName(apiType) {
      switch (apiType) {
        case "openai":
          return "OpenAI";
        case "gemini":
          return "Google Gemini";
        case "qwen":
          return "阿里云通义千问";
        default:
          return "未知";
      }
    },

    /**
     * 加载用户设置
     */
    loadSettings() {
      try {
        // 从油猴脚本存储中加载设置
        if (typeof GM_getValue !== "undefined") {
          const savedSettings = GM_getValue("captchaSettings");
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // 合并设置，确保新增字段也有默认值
            this.settings = { ...this.settings, ...parsedSettings };
          }

          // 加载规则
          const savedRules = GM_getValue("captchaRules");
          if (savedRules) {
            this.rules = JSON.parse(savedRules);
          } else {
            this.loadRules();
          }
        } else {
          // console.log('未检测到油猴环境，无法加载设置');
          // 尝试从 localStorage 加载设置（开发环境使用）
          const localSettings = localStorage.getItem("captchaSettings");
          if (localSettings) {
            const parsedSettings = JSON.parse(localSettings);
            // 合并设置，确保新增字段也有默认值
            this.settings = { ...this.settings, ...parsedSettings };
          }

          // 从 localStorage 加载规则
          const localRules = localStorage.getItem("captchaRules");
          if (localRules) {
            this.rules = JSON.parse(localRules);
          } else {
            this.loadRules();
          }
        }
      } catch (error) {
        console.error("加载设置失败：", error);
      }
    },

    /**
     * 加载验证码规则
     */
    async loadRules() {
      try {
        this.rulesLoadStatus = "loading";
        let rulesData;

        // 获取规则 URL，如果为空则使用默认 URL
        const rulesUrl =
          this.settings.rulesUrl ||
          "https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json";

        // 从 rules.json 文件加载规则
        const response = await this.request({
          method: "GET",
          url: rulesUrl,
          responseType: "json",
        });

        if (response && response.data) {
          rulesData = response.data;

          // 保存规则到存储
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("captchaRules", JSON.stringify(rulesData));
          } else {
            localStorage.setItem("captchaRules", JSON.stringify(rulesData));
          }

          this.rules = rulesData;
          this.rulesLoadStatus = "success";
          this.showToast("规则加载成功！", "success");
        } else {
          this.rulesLoadStatus = "error";
          this.showToast("规则加载失败，请稍后重试", "error");
        }
      } catch (error) {
        console.error("加载规则失败：", error);
        this.rulesLoadStatus = "error";
        this.showToast("规则加载失败：" + (error.message || "未知错误"), "error");
      }
    },

    /**
     * 重新加载验证码规则
     */
    async reloadRules() {
      await this.loadRules();
    },

    /**
     * 显示设置面板
     */
    openSettings() {
      // 先添加类阻止 body 滚动
      document.body.classList.add("captcha-settings-open");
      // 显示设置面板
      this.showSettings = true;
    },

    /**
     * 关闭设置面板
     */
    closeSettings() {
      // 移除阻止 body 滚动的类
      document.body.classList.remove("captcha-settings-open");
      // 关闭设置面板
      this.showSettings = false;
    },

    /**
     * 保存用户设置
     */
    saveSettings() {
      try {
        // 保存设置到油猴脚本存储
        if (typeof GM_setValue !== "undefined") {
          GM_setValue("captchaSettings", JSON.stringify(this.settings));
        } else {
          // console.log('未检测到油猴环境，将设置保存到 localStorage');
          // 保存到 localStorage（开发环境使用）
          localStorage.setItem("captchaSettings", JSON.stringify(this.settings));
        }
        this.closeSettings();
        this.showToast("设置已保存！", "success");
      } catch (error) {
        console.error("保存设置失败：", error);
        this.showToast("保存设置失败，请查看控制台获取更多信息。", "error");
      }
    },

    /**
     * 使用 AI 识别验证码
     * @param {string} base64Image - 验证码图片的 base64 编码
     * @returns {Promise<string>} - 识别结果
     */
    async recognizeCaptcha(base64Image) {
      // 检查是否配置了 API
      if (!this.isApiConfigured()) {
        console.error("未配置验证码识别 API");
        this.showToast("请先配置验证码识别 API", "error");
        this.openSettings();
        return "";
      }

      // 根据 API 类型调用不同的识别方法
      let result = "";
      try {
        // console.log("开始识别验证码，使用 API 类型:", this.settings.apiType);
        this.showToast("正在识别验证码...", "info");

        switch (this.settings.apiType) {
          case "openai":
            // console.log("使用 OpenAI API 识别验证码");
            result = await this.recognizeWithOpenAI(base64Image);
            break;
          case "gemini":
            // console.log("使用 Google Gemini API 识别验证码");
            result = await this.recognizeWithGemini(base64Image);
            break;
          case "qwen":
            // console.log("使用阿里云通义千问 API 识别验证码");
            result = await this.recognizeWithQwen(base64Image);
            break;
          default:
            // console.error("未知的 API 类型:", this.settings.apiType);
            this.showToast(`未知的 API 类型：${this.settings.apiType}`, "error");
            return "";
        }

        if (result) {
          // console.log("验证码识别成功:", result);
          this.showToast(`识别成功：${result}`, "success");
        } else {
          console.error("验证码识别结果为空");
          this.showToast("识别结果为空", "error");
        }

        return result;
      } catch (error) {
        console.error("验证码识别失败：", error);
        this.showToast("识别失败：" + (error.message || "未知错误"), "error");
        return "";
      }
    },

    /**
     * 检查 API 是否配置
     * @param {string} specificType - 指定要检查的 API 类型，不传则检查当前选中的 API
     * @returns {boolean} - API 是否已配置
     */
    isApiConfigured(specificType) {
      const typeToCheck = specificType || this.settings.apiType;
      switch (typeToCheck) {
        case "openai":
          return !!this.settings.openaiKey;
        case "gemini":
          return !!this.settings.geminiKey;
        case "qwen":
          return !!this.settings.qwenKey;
        default:
          return false;
      }
    },

    /**
     * 将图片或 canvas 转换为 base64 格式
     * @param {HTMLImageElement|HTMLCanvasElement} element - 图片或 canvas 元素
     * @returns {Object} - 返回包含成功状态和数据的对象
     */
    imageToBase64(element) {
      try {
        // 检查元素类型
        if (element.tagName === "CANVAS") {
          // 直接从 canvas 获取 base64 数据
          try {
            const base64Data = element.toDataURL("image/png").split(",")[1];

            // 检查 base64 数据是否有效
            if (!base64Data || base64Data.length < 100) {
              console.error("生成的canvas base64数据无效或过短");
              return {
                success: false,
                message: "Canvas数据转换失败或内容为空。请刷新验证码后重试。",
              };
            }

            // console.log("Canvas成功转换为base64");
            return {
              success: true,
              data: base64Data,
            };
          } catch (e) {
            console.error("从Canvas获取数据失败:", e);
            return {
              success: false,
              message: "无法从Canvas获取数据，可能是跨域限制。" + (e.message || ""),
            };
          }
        }

        // 以下是处理img元素的逻辑
        // 检查图片来源
        const imgSrc = element.src;
        // console.log("处理图片:", imgSrc);

        // 检查图片是否已加载完成
        if (!element.complete || !element.naturalWidth) {
          // console.log("图片尚未加载完成，等待加载");
          return {
            success: false,
            message: "图片尚未加载完成，请稍后重试",
          };
        }

        // 如果图片来源是外部链接且跨域（非 data:image 开头，且不是同域）
        if (!imgSrc.startsWith("data:image") && !this.isSameOrigin(imgSrc)) {
          // console.log("检测到跨域图片");

          // 如果还没有设置crossOrigin属性，设置并重新加载
          if (element.crossOrigin !== "anonymous") {
            // console.log("设置crossOrigin=anonymous并重新加载图片");
            element.crossOrigin = "anonymous";
            // 通过添加时间戳或随机参数强制重新加载
            const timestamp = new Date().getTime();
            const separator = imgSrc.includes("?") ? "&" : "?";
            element.src = `${imgSrc}${separator}_t=${timestamp}`;

            return {
              success: false,
              message: "正在处理跨域图片，请稍后重试",
            };
          }
        }

        // 创建 canvas
        const canvas = document.createElement("canvas");
        canvas.width = element.naturalWidth || element.width;
        canvas.height = element.naturalHeight || element.height;

        // console.log("Canvas尺寸:", canvas.width, "x", canvas.height);

        // 在 canvas 上绘制图片
        const ctx = canvas.getContext("2d");

        // 尝试绘制图片
        try {
          ctx.drawImage(element, 0, 0);
          // 测试能否访问图片数据（如果是跨域图片会抛出错误）
          ctx.getImageData(0, 0, 1, 1);
        } catch (e) {
          console.error("绘制图片到Canvas失败:", e);
          return {
            success: false,
            message: "无法读取图片数据，可能是跨域限制。请尝试手动下载验证码图片后识别。",
          };
        }

        // 转换为 base64
        const base64Data = canvas.toDataURL("image/png").split(",")[1];

        // 检查 base64 数据是否有效
        if (!base64Data || base64Data.length < 100) {
          console.error("生成的base64数据无效或过短");
          return {
            success: false,
            message: "图片转换失败或内容为空。请刷新验证码后重试。",
          };
        }

        // console.log("图片成功转换为base64");
        return {
          success: true,
          data: base64Data,
        };
      } catch (error) {
        console.error("图片转base64失败:", error);
        return {
          success: false,
          message: "图片转换失败: " + (error.message || "未知错误"),
        };
      }
    },

    /**
     * 检查URL是否与当前页面同源
     * @param {string} url - 要检查的URL
     * @returns {boolean} - 是否同源
     */
    isSameOrigin(url) {
      try {
        const currentOrigin = window.location.origin;
        const urlObj = new URL(url, currentOrigin);
        return urlObj.origin === currentOrigin;
      } catch (e) {
        return false;
      }
    },

    /**
     * 格式化OpenAI API URL，如果只提供了前缀，自动补全'/v1/chat/completions'
     * @param {string} url - 原始URL
     * @returns {string} - 格式化后的URL
     */
    formatOpenAIUrl(url) {
      if (!url) {
        return "https://api.openai.com/v1/chat/completions";
      }

      if (url.endsWith("#")) {
        return url.slice(0, -1);
      }
      if (url.endsWith("/chat/completions")) {
        return url;
      }

      if (!url.endsWith("/v1/chat/completions")) {
        // 移除末尾的斜杠（如果有）
        url = url.replace(/\/+$/, "");
        // 添加标准路径
        url = `${url}/v1/chat/completions`;
      }

      return url;
    },

    /**
     * 使用OpenAI API识别验证码
     */
    async recognizeWithOpenAI(base64Image) {
      // 使用自定义API地址或默认地址，并格式化URL
      const apiUrl = this.formatOpenAIUrl(this.settings.openaiApiUrl);

      // 使用自定义模型或默认模型
      const model = this.settings.openaiModel || "gpt-4.1-mini";
      // 使用自定义提示词或默认提示词
      const prompt = this.settings.openaiPrompt || DEFAULT_PROMPT;

      const response = await this.request({
        method: "POST",
        url: apiUrl,
        data: {
          model: model,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.settings.openaiKey}`,
        },
      });

      // 提取结果并移除所有非字母数字和负号字符（包括空格）
      const content = response.data.choices[0].message.content.trim();
      return content.replace(/[^a-zA-Z0-9\-]/g, "");
    },

    /**
     * 使用Google Gemini API识别验证码
     */
    async recognizeWithGemini(base64Image) {
      // 使用自定义模型或默认模型
      const model = this.settings.geminiModel || "gemini-2.5-flash-lite";
      // 使用自定义API地址或默认地址
      const baseApiUrl =
        this.settings.geminiApiUrl ||
        "https://generativelanguage.googleapis.com/v1beta/models";
      const apiUrl = `${baseApiUrl}/${model}:generateContent`;
      // 使用自定义提示词或默认提示词
      const prompt = this.settings.geminiPrompt || DEFAULT_PROMPT;

      const response = await this.request({
        method: "POST",
        url: `${apiUrl}?key=${this.settings.geminiKey}`,
        data: {
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: base64Image,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parts = response?.data?.candidates?.[0]?.content?.parts;
      if (!Array.isArray(parts) || parts.length === 0) {
        return "";
      }
      let fullText = "";
      for (const part of parts) {
        if (typeof part?.text === "string" && part.text && !part.thought) {
          fullText += part.text;
        }
      }
      if (!fullText) {
        return "";
      }
      const cleanText = fullText.replace(/<think>[\s\S]*?<\/think>/gi, "");
      return cleanText.replace(/[^a-zA-Z0-9\-]/g, "");
    },

    /**
     * 使用通义千问 API 识别验证码（新版 API 格式，messages/content 结构）
     */
    async recognizeWithQwen(base64Image) {
      const apiUrl =
        this.settings.qwenApiUrl ||
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
      const model = this.settings.qwenModel || "qwen-vl-max-2025-04-02";
      const prompt = this.settings.qwenPrompt || DEFAULT_PROMPT;

      const response = await this.request({
        method: "POST",
        url: apiUrl,
        data: {
          model: model,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: { url: `data:image/png;base64,${base64Image}` },
                },
              ],
            },
          ],
          temperature: 0.1,
          top_p: 1,
          stream: false,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.settings.qwenKey}`,
        },
      });

      // 提取结果
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const text = response.data.choices[0].message.content;
        // 只保留数字、字母和负号
        return text.replace(/[^a-zA-Z0-9\-]/g, "");
      }
      return "";
    },

    /**
     * 获取合并后的选择器字符串
     * @param {Array} selectors - 选择器数组
     * @returns {string} - 合并后的选择器字符串
     */
    getCombinedSelector(selectors) {
      // 合并默认选择器和自定义选择器
      let allSelectors = [...selectors];

      // 如果是验证码选择器，添加自定义验证码选择器
      if (
        selectors === this.config.captchaSelectors &&
        this.settings.customCaptchaSelectors
      ) {
        allSelectors = [
          ...allSelectors,
          ...this.settings.customCaptchaSelectors.filter((s) => s.trim()),
        ];
      }

      // 如果是输入框选择器，添加自定义输入框选择器
      if (
        selectors === this.config.inputSelectors &&
        this.settings.customInputSelectors
      ) {
        allSelectors = [
          ...allSelectors,
          ...this.settings.customInputSelectors.filter((s) => s.trim()),
        ];
      }

      return allSelectors.join(", ");
    },

    /**
     * 检测页面上的验证码图片
     */
    detectCaptchas() {
      // console.log("开始检测验证码图片");
      // 验证码检测定时器，防止频繁执行
      if (this.captchaCheckInterval) {
        clearInterval(this.captchaCheckInterval);
      }

      this.captchaCheckInterval = setInterval(() => {
        // 获取当前页面 URL
        const currentUrl = window.location.href;

        // 检查当前域名是否在禁用列表中
        if (this.isCurrentDomainDisabled()) {
          // console.log("当前网站在禁用列表中，跳过验证码检测");
          return;
        }

        // 创建所有可能的验证码图片选择器列表
        let captchaSelectors = [...this.config.captchaSelectors];

        // 添加用户自定义的验证码选择器
        if (Array.isArray(this.settings.customCaptchaSelectors)) {
          captchaSelectors = captchaSelectors.concat(
            this.settings.customCaptchaSelectors.filter((s) => s && s.trim())
          );
        }

        // 创建所有可能的输入框选择器列表
        let inputSelectors = [...this.config.inputSelectors];

        // 添加用户自定义的输入框选择器
        if (Array.isArray(this.settings.customInputSelectors)) {
          inputSelectors = inputSelectors.concat(
            this.settings.customInputSelectors.filter((s) => s && s.trim())
          );
        }

        // 应用规则匹配逻辑
        if (Array.isArray(this.rules) && this.rules.length > 0) {
          // 遍历规则列表
          for (const rule of this.rules) {
            // 跳过没有验证码选择器的规则
            if (!rule.captcha_image_selector) {
              continue;
            }

            // 检查 URL 是否匹配
            let isUrlMatch = false;
            if (!rule.url_pattern || rule.url_pattern === "*") {
              // 空或星号表示对所有网站生效
              isUrlMatch = true;
            } else if (
              rule.url_pattern.startsWith("/") &&
              rule.url_pattern.endsWith("/")
            ) {
              // 正则表达式匹配
              try {
                const regexPattern = rule.url_pattern.substring(
                  1,
                  rule.url_pattern.length - 1
                );
                const regex = new RegExp(regexPattern);
                isUrlMatch = regex.test(currentUrl);
              } catch (e) {
                console.error("无效的正则表达式规则：", rule.url_pattern, e);
              }
            } else if (rule.url_pattern.includes("*")) {
              // 通配符匹配
              const escapedPattern = rule.url_pattern
                .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // 转义特殊字符
                .replace(/\*/g, ".*"); // 替换 * 为 .*
              const regex = new RegExp(`^${escapedPattern}$`);
              isUrlMatch = regex.test(currentUrl);
            } else {
              // 精确匹配
              isUrlMatch = currentUrl.includes(rule.url_pattern);
            }

            // 如果 URL 匹配，应用此规则的选择器
            if (isUrlMatch) {
              // 添加验证码图片选择器
              if (
                rule.captcha_image_selector &&
                !captchaSelectors.includes(rule.captcha_image_selector)
              ) {
                captchaSelectors.push(rule.captcha_image_selector);
              }

              // 添加输入框选择器（如果有）
              if (
                rule.captcha_input_selector &&
                !inputSelectors.includes(rule.captcha_input_selector)
              ) {
                inputSelectors.push(rule.captcha_input_selector);
              }
            }
          }
        }

        try {
          // 使用组合后的选择器查找验证码
          let elements = [];

          captchaSelectors.forEach((selector) => {
            if (!selector || !selector.trim()) return;

            try {
              // 查找所有匹配的验证码图片
              const captchaImgs = document.querySelectorAll(selector);

              // 为每个验证码图片或 canvas 查找对应的输入框
              captchaImgs.forEach((captchaElement) => {
                // 检查元素类型，支持 img 和 canvas 两种类型
                if (
                  captchaElement.tagName !== "IMG" &&
                  captchaElement.tagName !== "CANVAS"
                ) {
                  return;
                }

                // 对于 img 元素，确保有 src 属性
                if (captchaElement.tagName === "IMG" && !captchaElement.src) {
                  return;
                }

                // 避免重复添加已处理的元素
                if (
                  captchaElement.nextElementSibling &&
                  captchaElement.nextElementSibling.classList.contains(
                    "captcha-recognition-icon"
                  )
                ) {
                  return;
                }

                // 寻找最近的输入框
                let inputField = this.findInputFieldForCaptcha(
                  captchaElement,
                  inputSelectors
                );

                // 为验证码元素添加识别按钮
                this.addRecognitionIcon(captchaElement, inputField);

                // 收集验证码元素信息
                elements.push({
                  captchaImg: captchaElement,
                  inputField,
                });
              });
            } catch (error) {
              console.error(`选择器 '${selector}' 执行出错:`, error);
            }
          });

          // 如果找到验证码图片
          if (elements.length > 0) {
            // console.log(`检测到 ${elements.length} 个新验证码图片`);
            // 显示提示信息
            this.showToast(
              `检测到 ${elements.length} 个验证码，点击识别图标开始识别`,
              "info"
            );

            // 如果启用了自动识别，处理所有验证码
            if (this.settings.autoRecognize) {
              // console.log("自动识别功能已开启，准备自动识别验证码");
              elements.forEach(({ captchaImg, inputField }) => {
                // 查找或创建识别图标
                let icon = captchaImg.nextElementSibling;
                if (icon && icon.classList.contains("captcha-recognition-icon")) {
                  // 获取 base64 结果
                  const base64Result = this.imageToBase64(captchaImg);
                  if (base64Result.success) {
                    // 自动进行识别
                    this.processCaptcha(captchaImg, inputField, icon, base64Result);
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error("检测验证码时出错：", error);
        }
      }, 500); // 延迟 500ms，确保图片已经加载完成
    },

    /**
     * 计算两个元素之间的距离
     */
    getDistance(el1, el2) {
      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();

      const x1 = rect1.left + rect1.width / 2;
      const y1 = rect1.top + rect1.height / 2;
      const x2 = rect2.left + rect2.width / 2;
      const y2 = rect2.top + rect2.height / 2;

      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    },

    /**
     * 在验证码图片旁添加识别图标
     */
    addIconsToCaptchas() {
      // 检查当前网站是否在禁用列表中
      if (this.isCurrentDomainDisabled()) {
        // console.log("当前网站在禁用列表中，不添加验证码识别图标");
        return;
      }

      // console.log("开始为验证码图片添加识别图标");
      try {
        const elements = this.findCaptchaElements();
        // console.log(`找到 ${elements.length} 个验证码元素，准备添加识别图标`);

        elements.forEach(({ captchaImg, inputField }) => {
          // 检查是否已经添加过图标
          const existingIcon = captchaImg.nextElementSibling;
          if (
            existingIcon &&
            existingIcon.classList.contains("captcha-recognition-icon")
          ) {
            // console.log("图片已有识别图标，跳过", captchaImg.src);
            return;
          }

          // console.log("为验证码图片添加识别图标", captchaImg.src);
          // 创建识别图标
          const icon = document.createElement("div");
          icon.classList.add("captcha-recognition-icon");
          icon.title = "点击识别验证码";

          // 将图标放在验证码图片后面（紧邻其后）
          if (captchaImg.nextSibling) {
            captchaImg.parentNode.insertBefore(icon, captchaImg.nextSibling);
          } else {
            captchaImg.parentNode.appendChild(icon);
          }

          // 添加点击事件
          icon.addEventListener("click", async (event) => {
            // 阻止事件冒泡，避免触发其他点击事件
            event.preventDefault();
            event.stopPropagation();
            // console.log("验证码识别图标被点击");
            this.processCaptcha(captchaImg, inputField, icon);
          });

          // console.log("成功添加验证码识别图标");
        });
      } catch (error) {
        console.error("添加验证码识别图标时出错：", error);
      }
    },

    /**
     * 处理验证码识别
     * @param {HTMLImageElement} captchaImg - 验证码图片元素
     * @param {HTMLInputElement} inputField - 输入框元素
     * @param {HTMLElement} icon - 识别图标元素
     * @param {Object} checkedBase64 - 可选，已经预先检查过的 base64 结果
     */
    async processCaptcha(captchaImg, inputField, icon, checkedBase64) {
      // 检查当前网站是否在禁用列表中
      if (this.isCurrentDomainDisabled()) {
        this.showToast("当前网站已设置为不启用验证码识别功能", "info");
        return;
      }

      try {
        // console.log("开始处理验证码识别", captchaImg.src);

        // 更新图标状态为加载中
        icon.classList.add("captcha-recognition-loading");

        // 获取 base64 编码的图片或 canvas
        let base64Result;
        if (checkedBase64) {
          // 如果已经有检查过的结果，直接使用
          base64Result = checkedBase64;
          // console.log("使用预先检查的 base64 结果");
        } else {
          // 根据元素类型进行不同的处理
          if (captchaImg.tagName === "CANVAS") {
            // 使用专门的 canvas 优化函数
            base64Result = this.optimizeCanvasImage(captchaImg);
            // 如果优化失败，回退到普通的转换
            if (!base64Result.success) {
              base64Result = this.imageToBase64(captchaImg);
            }
          } else {
            // 否则转换图片为 base64
            // console.log("开始转换图片为 base64");
            base64Result = this.imageToBase64(captchaImg);
          }

          // 如果转换失败，显示错误并终止识别
          if (!base64Result.success) {
            console.error("验证码转换失败：", base64Result.message);
            this.showToast(base64Result.message, "error");
            icon.classList.remove("captcha-recognition-loading");
            icon.classList.add("captcha-recognition-error");
            setTimeout(() => {
              icon.classList.remove("captcha-recognition-error");
            }, 2000);
            return;
          }
        }

        // 识别验证码
        // console.log("开始调用 AI 识别验证码");
        const text = await this.recognizeCaptcha(base64Result.data);
        // console.log("验证码识别结果:", text);

        // 如果识别结果为空，显示错误
        if (!text) {
          console.error("验证码识别结果为空");
          icon.classList.remove("captcha-recognition-loading");
          icon.classList.add("captcha-recognition-error");
          setTimeout(() => {
            icon.classList.remove("captcha-recognition-error");
          }, 2000);
          return;
        }

        // 检查是否找到了输入框
        if (!inputField) {
          // console.log("未找到输入框，尝试再次查找");
          // 尝试再次查找输入框
          inputField = this.findInputFieldForCaptcha(captchaImg);

          if (!inputField) {
            console.warn("仍未找到验证码输入框");
            this.showToast(`验证码已识别：${text}，但未找到输入框`, "warning");

            // 将识别结果复制到剪贴板，即使没有输入框
            if (this.settings.copyToClipboard) {
              try {
                await navigator.clipboard.writeText(text);
                // console.log("已将验证码复制到剪贴板");
                this.showToast(`已将验证码复制到剪贴板：${text}`, "success");
              } catch (clipboardError) {
                console.error("使用 Clipboard API 失败，尝试传统方法", clipboardError);
                // 如果剪贴板 API 不可用，使用传统方法
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.documentElement.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.documentElement.removeChild(textarea);
                this.showToast(`验证码已识别：${text} (已复制到剪贴板)`, "success");
              }
            }

            // 更新图标状态为成功，即使没找到输入框
            icon.classList.remove("captcha-recognition-loading");
            icon.classList.add("captcha-recognition-success");
            setTimeout(() => {
              icon.classList.remove("captcha-recognition-success");
            }, 2000);

            return;
          }
        }

        // console.log("找到输入框，准备填充验证码结果");
        // 填充结果到输入框
        inputField.value = text;
        // 触发输入事件，以便触发表单验证
        inputField.dispatchEvent(new Event("input", { bubbles: true }));
        inputField.dispatchEvent(new Event("change", { bubbles: true }));
        // console.log("已填充验证码结果到输入框");

        // 将识别结果复制到剪贴板
        if (this.settings.copyToClipboard) {
          try {
            await navigator.clipboard.writeText(text);
            // console.log("已将验证码复制到剪贴板");
            this.showToast(`已将验证码复制到剪贴板`, "success");
          } catch (clipboardError) {
            console.error("使用 Clipboard API 失败，尝试传统方法", clipboardError);
            // 如果剪贴板 API 不可用，使用传统方法
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.documentElement.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.documentElement.removeChild(textarea);
            this.showToast(`验证码已识别：${text} (已复制到剪贴板)`, "success");
          }
        } else {
          this.showToast(`验证码已识别：${text}`, "success");
        }

        // 更新图标状态为成功
        icon.classList.remove("captcha-recognition-loading");
        icon.classList.add("captcha-recognition-success");
        setTimeout(() => {
          icon.classList.remove("captcha-recognition-success");
        }, 2000);
      } catch (error) {
        console.error("验证码识别处理失败：", error);
        icon.classList.remove("captcha-recognition-loading");
        icon.classList.add("captcha-recognition-error");
        setTimeout(() => {
          icon.classList.remove("captcha-recognition-error");
        }, 2000);

        this.showToast("处理验证码失败：" + (error.message || "未知错误"), "error");
      }
    },

    /**
     * 监听 DOM 变化，自动为新添加的验证码添加识别图标
     */
    setupMutationObserver() {
      // 检查当前网站是否在禁用列表中
      if (this.isCurrentDomainDisabled()) {
        return;
      }

      const observer = new MutationObserver((mutations) => {
        let hasNewCaptcha = false;
        let newCaptchaElements = [];
        const captchaSelector = this.getCombinedSelector(this.config.captchaSelectors);

        mutations.forEach((mutation) => {
          // 检查新增节点
          if (mutation.type === "childList" && mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const captchas = node.querySelectorAll(captchaSelector);
                if (captchas.length > 0) {
                  hasNewCaptcha = true;
                  captchas.forEach((captcha) => {
                    newCaptchaElements.push(captcha);
                  });
                }

                // 检查节点本身是否为验证码图片
                if (node.matches && node.matches(captchaSelector)) {
                  hasNewCaptcha = true;
                  newCaptchaElements.push(node);
                }
              }
            });
          }

          // 检查属性变化 - 特别是 src 属性变化的验证码图片
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src" &&
            mutation.target.matches &&
            mutation.target.matches(captchaSelector)
          ) {
            hasNewCaptcha = true;
            newCaptchaElements.push(mutation.target);

            // 记录日志，帮助调试
            // console.log("检测到验证码图片 src 变化:", mutation.target.src);
          }
        });

        if (hasNewCaptcha) {
          this.addIconsToCaptchas();

          // 对新检测到的验证码元素进行自动识别处理
          // 只有当启用了自动识别功能时才执行
          if (this.settings.autoRecognize) {
            setTimeout(() => {
              const elements = this.findCaptchaElements();

              // 过滤出新检测到的元素
              const newElements = elements.filter(({ captchaImg }) =>
                newCaptchaElements.includes(captchaImg)
              );

              // 预先检测是否有不可识别的图片
              const unrecognizableImages = [];
              newElements.forEach(({ captchaImg }) => {
                // 预先检测图片是否可以转换为 base64
                const base64Result = this.imageToBase64(captchaImg);
                if (!base64Result.success) {
                  unrecognizableImages.push({
                    img: captchaImg,
                    message: base64Result.message,
                  });
                }
              });

              // 如果有不可识别的图片，显示提示
              if (unrecognizableImages.length > 0) {
                this.showToast(
                  `检测到 ${unrecognizableImages.length} 个新验证码图片无法识别：${unrecognizableImages[0].message}`,
                  "error"
                );
              }

              // 只识别可识别的图片
              const recognizableElements = newElements.filter(({ captchaImg }) => {
                const base64Result = this.imageToBase64(captchaImg);
                return base64Result.success;
              });

              // 处理可识别的图片
              if (recognizableElements.length > 0) {
                // console.log("准备自动识别验证码:", recognizableElements.length);
                recognizableElements.forEach(({ captchaImg, inputField }) => {
                  // 查找或创建识别图标
                  let icon;
                  const existingIcon = captchaImg.nextElementSibling;
                  if (
                    existingIcon &&
                    existingIcon.classList.contains("captcha-recognition-icon")
                  ) {
                    icon = existingIcon;
                  } else {
                    icon = document.createElement("div");
                    icon.classList.add("captcha-recognition-icon");
                    if (captchaImg.nextSibling) {
                      captchaImg.parentNode.insertBefore(icon, captchaImg.nextSibling);
                    } else {
                      captchaImg.parentNode.appendChild(icon);
                    }
                  }

                  // 获取 base64 结果，避免重复转换
                  const base64Result = this.imageToBase64(captchaImg);
                  // 自动进行识别，传入已检查的 base64 结果
                  this.processCaptcha(captchaImg, inputField, icon, base64Result);
                });
              } else if (newElements.length > 0) {
                this.showToast(
                  `检测到 ${newElements.length} 个新验证码，但均无法自动识别`,
                  "error"
                );
              }
            }, 500); // 延迟 500ms，确保图片已经加载完成
          }
        }
      });

      // 监听整个文档的变化，包括子树和属性变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"], // 只监听 src 属性变化
      });
    },

    /**
     * 注册油猴菜单
     */
    registerMenuCommands() {
      // 检查是否在油猴环境中
      if (typeof GM_registerMenuCommand !== "undefined") {
        GM_registerMenuCommand("验证码识别设置", () => {
          this.openSettings();
        });
      } else {
        // console.log('未检测到油猴环境，跳过菜单注册');
      }
    },

    /**
     * 初始化插件
     */
    init() {
      // console.log("初始化验证码识别插件");
      this.registerMenuCommands();
      this.loadSettings();

      // 检查是否需要自动获取云端配置（每天首次使用）
      this.checkAndFetchCloudConfig();

      // 检查当前网站是否在禁用列表中
      if (this.isCurrentDomainDisabled()) {
        // console.log("当前网站在禁用列表中，不启用验证码识别功能");
        return;
      }

      // 确保页面完全加载后再初始化
      const initPlugin = () => {
        // console.log("开始初始化验证码识别功能");
        try {
          this.addIconsToCaptchas(); // 步骤 1: 确保所有图标都已创建
          this.setupMutationObserver();
          this.detectCaptchas(); // 启动定时检测
          const elements = this.findCaptchaElements();
          // console.log(`检测到 ${elements.length} 个验证码元素`);

          if (elements.length > 0) {
            // 新增逻辑：预先检测验证码图片是否可以识别
            const unrecognizableImages = [];
            elements.forEach(({ captchaImg }) => {
              // 预先检测图片是否可以转换为 base64
              const base64Result = this.imageToBase64(captchaImg);
              if (!base64Result.success) {
                unrecognizableImages.push({
                  img: captchaImg,
                  message: base64Result.message,
                });
              }
            });

            // 如果有不可识别的图片，显示提示
            if (unrecognizableImages.length > 0) {
              console.warn(
                `${unrecognizableImages.length} 个验证码图片无法识别：${unrecognizableImages[0].message}`
              );
              this.showToast(
                `检测到 ${unrecognizableImages.length} 个验证码图片无法识别：${unrecognizableImages[0].message}`,
                "error"
              );
            }

            // 检查初始加载时的自动识别设置
            if (this.settings.autoRecognize) {
              // console.log("自动识别功能已开启，准备识别验证码");
              // 只识别可识别的图片
              const recognizableElements = elements.filter(({ captchaImg }) => {
                const base64Result = this.imageToBase64(captchaImg);
                return base64Result.success;
              });

              if (recognizableElements.length > 0) {
                // console.log(`开始自动识别 ${recognizableElements.length} 个验证码`);
                this.showToast(
                  `检测到 ${recognizableElements.length} 个可识别的验证码，正在自动识别...`,
                  "info"
                );
                // 遍历所有找到的可识别验证码并处理
                recognizableElements.forEach(({ captchaImg, inputField }) => {
                  // 查找或创建识别图标
                  let icon;
                  const existingIcon = captchaImg.nextElementSibling;
                  if (
                    existingIcon &&
                    existingIcon.classList.contains("captcha-recognition-icon")
                  ) {
                    icon = existingIcon;
                  } else {
                    icon = document.createElement("div");
                    icon.classList.add("captcha-recognition-icon");
                    if (captchaImg.nextSibling) {
                      captchaImg.parentNode.insertBefore(icon, captchaImg.nextSibling);
                    } else {
                      captchaImg.parentNode.appendChild(icon);
                    }
                  }

                  // 获取 base64 结果，避免重复转换
                  const base64Result = this.imageToBase64(captchaImg);
                  // 直接调用处理函数，传入已检查的 base64 结果
                  this.processCaptcha(captchaImg, inputField, icon, base64Result);
                });
              } else if (elements.length > 0) {
                console.warn(`检测到 ${elements.length} 个验证码，但均无法自动识别`);
                this.showToast(
                  `检测到 ${elements.length} 个验证码，但均无法自动识别`,
                  "error"
                );
              }
            } else {
              // 保留原始行为：如果未开启自动识别，则提示用户点击
              // console.log("自动识别功能未开启，提示用户手动点击识别");
              this.showToast(
                `检测到 ${elements.length} 个验证码，点击识别图标开始识别`,
                "info"
              );
            }
          }
        } catch (error) {
          console.error("初始化验证码识别功能失败：", error);
          this.showToast(
            `初始化验证码识别功能失败：${error.message || "未知错误"}`,
            "error"
          );
        }
      };

      // 在页面完全加载后执行初始化
      if (document.readyState === "complete") {
        setTimeout(initPlugin, 1000);
      } else {
        window.addEventListener("load", () => {
          setTimeout(initPlugin, 1000);
        });
      }
    },

    /**
     * 通用请求函数，自动根据环境使用 GM_xmlhttpRequest 或 axios
     * @param {Object} config - 请求配置
     * @returns {Promise} - 请求结果
     */
    request(config) {
      // 检查是否在油猴环境中
      if (typeof GM_xmlhttpRequest !== "undefined") {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: config.method || "GET",
            url: config.url,
            data: config.data
              ? typeof config.data === "string"
                ? config.data
                : JSON.stringify(config.data)
              : undefined,
            headers: config.headers || {},
            responseType: config.responseType || "json",
            onload: (response) => {
              if (response.status >= 200 && response.status < 300) {
                let responseData;
                try {
                  responseData =
                    config.responseType === "json" &&
                    typeof response.response === "string"
                      ? JSON.parse(response.response || response.responseText)
                      : response.response || response.responseText;
                } catch (e) {
                  responseData = response.response || response.responseText;
                }
                resolve({ data: responseData });
              } else {
                reject(new Error(`请求失败，状态码: ${response.status}`));
              }
            },
            onerror: (error) => {
              reject(error);
            },
          });
        });
      } else {
        // 在非油猴环境中，移除可能导致问题的头部
        const safeHeaders = { ...config.headers };
        const unsafeHeaders = ["Host", "Origin", "Referer", "Cookie"];

        unsafeHeaders.forEach((header) => {
          if (safeHeaders[header]) {
            delete safeHeaders[header];
          }
        });

        // 使用 axios
        return axios({
          method: config.method || "GET",
          url: config.url,
          data: config.data,
          params: config.params,
          headers: safeHeaders,
          responseType: config.responseType,
        });
      }
    },

    /**
     * 显示 Toast 提示
     * @param {string} message - 提示信息
     * @param {string} type - 提示类型 (success, error, info)
     */
    showToast(message, type = "info") {
      // 如果用户禁用了通知，则不显示
      if (this.settings.showNotification === false) {
        return;
      }

      // 创建 toast 容器（如果不存在）
      let toastContainer = document.getElementById("captcha-toast-container");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "captcha-toast-container";
        document.documentElement.appendChild(toastContainer);
      }

      // 创建新的 toast 元素
      const toast = document.createElement("div");
      toast.className = `captcha-toast captcha-toast-${type}`;
      toast.textContent = message;

      // 将新 toast 插入到容器的最前面
      if (toastContainer.firstChild) {
        toastContainer.insertBefore(toast, toastContainer.firstChild);
      } else {
        toastContainer.appendChild(toast);
      }

      // 添加显示动画
      setTimeout(() => {
        toast.classList.add("captcha-toast-show");
      }, 10);

      // 3 秒后移除
      setTimeout(() => {
        toast.classList.remove("captcha-toast-show");
        toast.classList.add("captcha-toast-hide");

        // 动画结束后移除元素
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300); // 300ms 是动画持续时间
      }, 3000);
    },

    /**
     * 测试 API 连通性
     * @param {string} apiType - API 类型，'openai'或'gemini'
     */
    async testApiConnection(apiType) {
      try {
        if (!this.isApiConfigured(apiType)) {
          this.apiTestStatus[apiType] = "error";
          // 3 秒后重置状态
          setTimeout(() => {
            this.apiTestStatus[apiType] = "";
          }, 3000);
          return;
        }

        // 设置加载状态
        this.apiTestStatus[apiType] = "loading";

        // 测试图片 base64
        const testBase64Image =
          "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";

        if (apiType === "openai") {
          // 测试 OpenAI API
          const apiUrl = this.formatOpenAIUrl(this.settings.openaiApiUrl);
          const model = this.settings.openaiModel || "gpt-4.1-mini";

          const response = await this.request({
            method: "POST",
            url: apiUrl,
            data: {
              model: model,
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "这是一个验证码图片，请识别其中的字符",
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:image/png;base64,${testBase64Image}`,
                      },
                    },
                  ],
                },
              ],
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.settings.openaiKey}`,
            },
          });

          if (response && response.data) {
            this.apiTestStatus[apiType] = "success";
          }
        } else if (apiType === "gemini") {
          // 测试 Google Gemini API
          const model = this.settings.geminiModel || "gemini-2.5-flash-lite";
          const baseApiUrl =
            this.settings.geminiApiUrl ||
            "https://generativelanguage.googleapis.com/v1beta/models";
          const apiUrl = `${baseApiUrl}/${model}:generateContent`;

          const response = await this.request({
            method: "POST",
            url: `${apiUrl}?key=${this.settings.geminiKey}`,
            data: {
              contents: [
                {
                  parts: [
                    {
                      text: "这是一个验证码图片，请识别其中的字符",
                    },
                    {
                      inline_data: {
                        mime_type: "image/png",
                        data: testBase64Image,
                      },
                    },
                  ],
                },
              ],
            },
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response && response.data) {
            this.apiTestStatus[apiType] = "success";
          }
        } else if (apiType === "qwen") {
          // 测试阿里云通义千问 API
          const apiUrl =
            this.settings.qwenApiUrl ||
            "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
          const model = this.settings.qwenModel || "qwen-vl-max-2025-04-02";

          const response = await this.request({
            method: "POST",
            url: apiUrl,
            data: {
              model: model,
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "这是一个验证码图片，请识别其中的字符",
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:image/png;base64,${testBase64Image}`,
                      },
                    },
                  ],
                },
              ],
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.settings.qwenKey}`,
            },
          });

          if (response && response.data) {
            this.apiTestStatus[apiType] = "success";
          }
        }

        // 3 秒后重置状态
        setTimeout(() => {
          this.apiTestStatus[apiType] = "";
        }, 3000);
      } catch (error) {
        console.error("API 连接测试失败：", error);
        this.apiTestStatus[apiType] = "error";

        // 3 秒后重置状态
        setTimeout(() => {
          this.apiTestStatus[apiType] = "";
        }, 3000);
      }
    },

    /**
     * 检查域名是否在禁用列表中
     * @param {string} domain - 要检查的域名
     * @returns {boolean} - 如果域名在禁用列表中返回 true，否则返回 false
     */
    isDisabledDomain(domain) {
      // 如果禁用域名列表为空，则所有域名都启用
      if (!this.settings.disabledDomains) {
        return false;
      }

      // 分割并清理禁用域名列表
      const disabledDomainsList = this.settings.disabledDomains
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      // 遍历禁用域名列表，检查当前域名是否匹配
      for (const disabledDomain of disabledDomainsList) {
        try {
          // 检查是否为正则表达式格式 (以 / 开头和结尾)
          if (disabledDomain.startsWith("/") && disabledDomain.endsWith("/")) {
            const regexPattern = disabledDomain.substring(1, disabledDomain.length - 1);
            const regex = new RegExp(regexPattern);
            if (regex.test(domain)) {
              return true;
            }
          }
          // 检查是否包含通配符 *
          else if (disabledDomain.includes("*")) {
            const escapedPattern = disabledDomain
              .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // 转义特殊字符
              .replace(/\*/g, ".*"); // 替换 * 为 .*
            const regex = new RegExp(`^${escapedPattern}$`);
            if (regex.test(domain)) {
              return true;
            }
          }
          // 简单的字符串匹配
          else if (domain.includes(disabledDomain)) {
            return true;
          }
        } catch (error) {
          console.error(`检查禁用域名时出错 (${disabledDomain}):`, error);
        }
      }

      return false;
    },

    /**
     * 添加自定义选择器
     * @param {string} type - 选择器类型，'captcha'或'input'
     */
    addSelector(type) {
      if (type === "captcha") {
        this.settings.customCaptchaSelectors.push("");
      } else if (type === "input") {
        this.settings.customInputSelectors.push("");
      }
    },

    /**
     * 删除自定义选择器
     * @param {string} type - 选择器类型，'captcha'或'input'
     * @param {number} index - 要删除的选择器索引
     */
    removeSelector(type, index) {
      if (type === "captcha") {
        this.settings.customCaptchaSelectors.splice(index, 1);
      } else if (type === "input") {
        this.settings.customInputSelectors.splice(index, 1);
      }
    },

    /**
     * 检查当前网站是否在禁用域名列表中
     * @returns {boolean} - 如果当前网站在禁用列表中，则返回 true
     */
    isCurrentDomainDisabled() {
      if (!this.settings.disabledDomains) {
        return false;
      }

      const currentDomain = window.location.hostname;
      const disabledDomainsList = this.settings.disabledDomains
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      for (const domain of disabledDomainsList) {
        // 检查是否是正则表达式格式 /pattern/
        if (domain.startsWith("/") && domain.endsWith("/")) {
          try {
            const regexPattern = domain.substring(1, domain.length - 1);
            const regex = new RegExp(regexPattern);
            if (regex.test(currentDomain)) {
              return true;
            }
          } catch (e) {
            console.error("无效的正则表达式：", domain, e);
          }
          continue;
        }

        // 处理通配符 * (转换为正则表达式)
        if (domain.includes("*")) {
          const regexPattern = domain.replace(/\./g, "\\.").replace(/\*/g, ".*");
          try {
            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(currentDomain)) {
              return true;
            }
          } catch (e) {
            console.error("无效的通配符模式：", domain, e);
          }
          continue;
        }

        // 精确匹配
        if (domain === currentDomain) {
          return true;
        }
      }

      return false;
    },

    /**
     * 为验证码元素 (图片或 canvas) 添加识别图标
     * @param {HTMLImageElement|HTMLCanvasElement} captchaElement - 验证码元素 (图片或 canvas)
     * @param {HTMLInputElement} inputField - 输入框元素
     */
    addRecognitionIcon(captchaElement, inputField) {
      // 检查是否已经添加过图标
      const existingIcon = captchaElement.nextElementSibling;
      if (existingIcon && existingIcon.classList.contains("captcha-recognition-icon")) {
        return;
      }

      // 创建识别图标
      const icon = document.createElement("div");
      icon.classList.add("captcha-recognition-icon");
      icon.title = "点击识别验证码";

      // 将图标放在验证码元素后面（紧邻其后）
      if (captchaElement.nextSibling) {
        captchaElement.parentNode.insertBefore(icon, captchaElement.nextSibling);
      } else {
        captchaElement.parentNode.appendChild(icon);
      }

      // 添加点击事件
      icon.addEventListener("click", async () => {
        this.processCaptcha(captchaElement, inputField, icon);
      });
    },

    /**
     * 查找页面上的验证码图片和相关输入框
     * @returns {Array} - 包含验证码图片和相关输入框的对象数组
     */
    findCaptchaElements() {
      // console.log("开始查找验证码元素");
      // 创建所有可能的验证码图片选择器列表
      let captchaSelectors = [...this.config.captchaSelectors];

      // 添加用户自定义的验证码选择器
      if (Array.isArray(this.settings.customCaptchaSelectors)) {
        captchaSelectors = captchaSelectors.concat(
          this.settings.customCaptchaSelectors.filter((s) => s && s.trim())
        );
      }

      // 创建所有可能的输入框选择器列表
      let inputSelectors = [...this.config.inputSelectors];

      // 添加用户自定义的输入框选择器
      if (Array.isArray(this.settings.customInputSelectors)) {
        inputSelectors = inputSelectors.concat(
          this.settings.customInputSelectors.filter((s) => s && s.trim())
        );
      }

      // console.log("验证码选择器:", captchaSelectors);
      // console.log("输入框选择器:", inputSelectors);

      // 应用规则匹配逻辑
      const currentUrl = window.location.href;
      if (Array.isArray(this.rules) && this.rules.length > 0) {
        // console.log(`应用 ${this.rules.length} 条规则进行匹配`);
        // 遍历规则列表
        for (const rule of this.rules) {
          // 跳过没有验证码选择器的规则
          if (!rule.captcha_image_selector) {
            continue;
          }

          // 检查 URL 是否匹配
          let isUrlMatch = false;
          if (!rule.url_pattern || rule.url_pattern === "*") {
            // 空或星号表示对所有网站生效
            isUrlMatch = true;
          } else if (rule.url_pattern.startsWith("/") && rule.url_pattern.endsWith("/")) {
            // 正则表达式匹配
            try {
              const regexPattern = rule.url_pattern.substring(
                1,
                rule.url_pattern.length - 1
              );
              const regex = new RegExp(regexPattern);
              isUrlMatch = regex.test(currentUrl);
            } catch (e) {
              console.error("无效的正则表达式规则：", rule.url_pattern, e);
            }
          } else if (rule.url_pattern.includes("*")) {
            // 通配符匹配
            const escapedPattern = rule.url_pattern
              .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // 转义特殊字符
              .replace(/\*/g, ".*"); // 替换 * 为 .*
            const regex = new RegExp(`^${escapedPattern}$`);
            isUrlMatch = regex.test(currentUrl);
          } else {
            // 精确匹配
            isUrlMatch = currentUrl.includes(rule.url_pattern);
          }

          // 如果 URL 匹配，应用此规则的选择器
          if (isUrlMatch) {
            // console.log(`匹配到规则：${rule.url_pattern || '*'}`);
            // 添加验证码图片选择器
            if (
              rule.captcha_image_selector &&
              !captchaSelectors.includes(rule.captcha_image_selector)
            ) {
              // console.log(`添加验证码选择器：${rule.captcha_image_selector}`);
              captchaSelectors.push(rule.captcha_image_selector);
            }

            // 添加输入框选择器（如果有）
            if (
              rule.captcha_input_selector &&
              !inputSelectors.includes(rule.captcha_input_selector)
            ) {
              // console.log(`添加输入框选择器：${rule.captcha_input_selector}`);
              inputSelectors.push(rule.captcha_input_selector);
            }
          }
        }
      }

      // 使用组合后的选择器查找验证码
      const elements = [];

      captchaSelectors.forEach((selector) => {
        if (!selector || !selector.trim()) return;

        try {
          // 查找所有匹配的验证码图片
          const captchaImgs = document.querySelectorAll(selector);
          // console.log(`选择器 '${selector}' 找到 ${captchaImgs.length} 个匹配元素`);

          // 为每个验证码图片查找对应的输入框
          captchaImgs.forEach((captchaElement) => {
            // 支持 img 和 canvas 两种类型
            if (captchaElement.tagName !== "IMG" && captchaElement.tagName !== "CANVAS") {
              // console.log(`跳过非图片/canvas 元素:`, captchaElement);
              return;
            }

            // 对于 img 元素，确保有 src 属性
            if (captchaElement.tagName === "IMG" && !captchaElement.src) {
              // console.log(`跳过没有 src 属性的图片元素`);
              return;
            }

            // 寻找最近的输入框
            let inputField = this.findInputFieldForCaptcha(
              captchaElement,
              inputSelectors
            );
            if (inputField) {
              // console.log(`为验证码元素找到输入框:`, inputField);
            } else {
              // console.log(`未找到验证码元素对应的输入框`);
            }

            // 收集验证码元素信息
            elements.push({
              captchaImg: captchaElement,
              inputField,
            });
          });
        } catch (error) {
          console.error(`选择器 '${selector}' 执行出错:`, error);
        }
      });

      // console.log(`总共找到 ${elements.length} 个验证码元素`);
      return elements;
    },

    /**
     * 为验证码图片查找对应的输入框
     * @param {HTMLImageElement} captchaImg - 验证码图片元素
     * @param {Array} [customSelectors] - 自定义输入框选择器列表，可选
     * @returns {HTMLInputElement|null} - 找到的输入框元素，或 null
     */
    findInputFieldForCaptcha(captchaImg, customSelectors) {
      // 定义基础过滤条件，排除 hidden 类型的输入框
      const baseFilter = ':not([type="hidden"])';

      // 确定使用的选择器列表
      let inputSelectors = customSelectors || [...this.config.inputSelectors];

      // 处理每个选择器，确保都应用了基础过滤条件
      inputSelectors = inputSelectors.map((selector) => {
        // 如果选择器已经包含:not([type="hidden"])，则不重复添加
        if (selector.includes(':not([type="hidden"])')) {
          return selector;
        }
        return `${selector}${baseFilter}`;
      });

      // 如果没有提供自定义选择器，则添加用户自定义的输入框选择器
      if (!customSelectors && Array.isArray(this.settings.customInputSelectors)) {
        // 同样对自定义选择器应用过滤
        const filteredCustomSelectors = this.settings.customInputSelectors.map(
          (selector) => {
            if (!selector) return "";
            if (selector.includes(':not([type="hidden"])')) {
              return selector;
            }
            return `${selector}${baseFilter}`;
          }
        );

        inputSelectors = inputSelectors.concat(filteredCustomSelectors.filter((s) => s));
      }

      // 添加规则中的选择器
      const currentUrl = window.location.href;
      if (Array.isArray(this.rules) && this.rules.length > 0) {
        // 遍历规则列表
        for (const rule of this.rules) {
          // 跳过没有输入框选择器的规则
          if (!rule.captcha_input_selector) {
            continue;
          }

          // 检查 URL 是否匹配
          let isUrlMatch = false;
          if (!rule.url_pattern || rule.url_pattern === "*") {
            // 空或星号表示对所有网站生效
            isUrlMatch = true;
          } else if (rule.url_pattern.startsWith("/") && rule.url_pattern.endsWith("/")) {
            // 正则表达式匹配
            try {
              const regexPattern = rule.url_pattern.substring(
                1,
                rule.url_pattern.length - 1
              );
              const regex = new RegExp(regexPattern);
              isUrlMatch = regex.test(currentUrl);
            } catch (e) {
              console.error("Invalid regex pattern:", rule.url_pattern);
            }
          } else if (rule.url_pattern.includes("*")) {
            // 通配符匹配
            const escapedPattern = rule.url_pattern
              .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // 转义特殊字符
              .replace(/\*/g, ".*"); // 替换 * 为 .*
            const regex = new RegExp(`^${escapedPattern}$`);
            isUrlMatch = regex.test(currentUrl);
          } else {
            // 精确匹配
            isUrlMatch = currentUrl.includes(rule.url_pattern);
          }

          // 如果 URL 匹配，应用此规则的选择器
          if (
            isUrlMatch &&
            rule.captcha_input_selector &&
            !inputSelectors.includes(rule.captcha_input_selector)
          ) {
            inputSelectors.push(rule.captcha_input_selector);
          }
        }
      }

      let inputField = null;

      // 方法 1: 先检查最近的父元素
      const parentElement = captchaImg.parentElement;
      if (parentElement) {
        for (const selector of inputSelectors) {
          try {
            const inputs = parentElement.querySelectorAll(selector);
            if (inputs.length > 0) {
              inputField = inputs[0];
              break;
            }
          } catch (e) {
            console.error(`选择器 ${selector} 执行出错:`, e);
          }
        }
      }

      // 方法 2: 如果在父元素中没找到，检查整个表单
      if (!inputField && parentElement) {
        // 向上查找表单元素
        let form = parentElement;
        while (form && form.tagName !== "FORM" && form !== document.body) {
          form = form.parentElement;
        }

        if (form && form.tagName === "FORM") {
          for (const selector of inputSelectors) {
            try {
              const inputs = form.querySelectorAll(selector);
              if (inputs.length > 0) {
                inputField = inputs[0];
                break;
              }
            } catch (e) {
              console.error(`选择器 ${selector} 执行出错:`, e);
            }
          }
        }
      }

      // 方法 3: 如果仍然没有找到，检查整个文档
      if (!inputField) {
        for (const selector of inputSelectors) {
          try {
            const inputs = document.querySelectorAll(selector);
            if (inputs.length > 0) {
              inputField = inputs[0];
              break;
            }
          } catch (e) {
            console.error(`选择器 ${selector} 执行出错:`, e);
          }
        }
      }

      // 方法 4: 如果还没找到，尝试通过更一般的选择器查找
      if (!inputField) {
        // 尝试查找任何非 hidden 类型的输入框
        const inputs = document.querySelectorAll('input:not([type="hidden"])');
        if (inputs.length > 0) {
          // 寻找名称或属性与验证码相关的输入框
          for (const input of inputs) {
            const name = input.name ? input.name.toLowerCase() : "";
            const id = input.id ? input.id.toLowerCase() : "";
            const placeholder = input.placeholder ? input.placeholder.toLowerCase() : "";

            if (
              name.includes("captcha") ||
              name.includes("verif") ||
              id.includes("captcha") ||
              id.includes("verif") ||
              placeholder.includes("captcha") ||
              placeholder.includes("验证码")
            ) {
              inputField = input;
              break;
            }
          }

          // 如果仍然没有找到，使用第一个非 hidden 的输入框
          if (!inputField) {
            // 确保找到的第一个输入框不是 hidden 类型
            for (const input of inputs) {
              if (input.type !== "hidden") {
                inputField = input;
                break;
              }
            }
          }
        }
      }

      return inputField;
    },

    /**
     * 检查并自动获取云端配置（每天首次使用）
     */
    async checkAndFetchCloudConfig() {
      try {
        // 检查是否启用了自动获取云端规则功能
        if (!this.settings.autoFetchCloudRules) {
          return;
        }

        // 获取当前日期（格式：YYYY-MM-DD）
        const today = new Date().toISOString().split("T")[0];

        // 从存储中获取上次更新配置的日期
        let lastConfigUpdate;
        if (typeof GM_getValue !== "undefined") {
          lastConfigUpdate = GM_getValue("lastConfigUpdate");
        } else {
          lastConfigUpdate = localStorage.getItem("lastConfigUpdate");
        }

        // 如果没有记录或者不是今天，则更新配置
        if (!lastConfigUpdate || lastConfigUpdate !== today) {
          // 显示提示
          this.showToast("正在获取最新云端配置...", "info");

          // 加载最新规则
          await this.loadRules();

          // 记录更新日期
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("lastConfigUpdate", today);
          } else {
            localStorage.setItem("lastConfigUpdate", today);
          }

          this.showToast("云端配置更新完成", "success");
        }
      } catch (error) {
        console.error("自动获取云端配置失败：", error);
        // 失败时不显示提示，避免影响用户体验
      }
    },

    /**
     * 优化 Canvas 验证码图像
     * @param {HTMLCanvasElement} canvasElement - canvas 元素
     * @returns {Object} - 返回包含成功状态和数据的对象
     */
    optimizeCanvasImage(canvasElement) {
      try {
        // 获取 canvas 上下文
        const ctx = canvasElement.getContext("2d");
        if (!ctx) {
          return {
            success: false,
            message: "无法获取 Canvas 上下文",
          };
        }

        // 获取图像数据
        const imageData = ctx.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const data = imageData.data;

        // 创建一个新的 canvas 用于保存优化后的图像
        const optimizedCanvas = document.createElement("canvas");
        optimizedCanvas.width = canvasElement.width;
        optimizedCanvas.height = canvasElement.height;
        const optimizedCtx = optimizedCanvas.getContext("2d");

        // 复制原始图像数据
        optimizedCtx.putImageData(imageData, 0, 0);

        // 转换为 base64
        const base64Data = optimizedCanvas.toDataURL("image/png").split(",")[1];

        // 检查 base64 数据是否有效
        if (!base64Data || base64Data.length < 100) {
          return {
            success: false,
            message: "优化Canvas数据失败或内容为空",
          };
        }

        return {
          success: true,
          data: base64Data,
        };
      } catch (error) {
        console.error("优化Canvas图像失败:", error);
        return {
          success: false,
          message: "优化Canvas图像失败: " + (error.message || "未知错误"),
        };
      }
    },
  },
  mounted() {
    // console.log("验证码识别插件已挂载");
    try {
      // 加载用户设置
      this.loadSettings();

      // 默认关闭设置面板
      this.showSettings = false;

      // 注册油猴菜单
      if (typeof GM_registerMenuCommand !== "undefined") {
        // console.log("注册油猴菜单");
        GM_registerMenuCommand("验证码识别设置", () => {
          this.openSettings();
        });
      } else {
        // console.log("未检测到油猴环境，跳过菜单注册");
      }

      // 初始化验证码识别功能
      this.init();
    } catch (error) {
      console.error("验证码识别插件挂载失败：", error);
    }
  },
  created() {
    // console.log("验证码识别插件已创建");
    try {
      // Website Compatibility Handling
      if (window.location.host == "nportal.ntut.edu.tw") {
        // console.log("检测到特殊网站：nportal.ntut.edu.tw，应用兼容性处理");
        const observer = new MutationObserver(function (mutations) {
          const authcodeElement = document.querySelector(".authcode.co");
          if (authcodeElement) {
            const captchaIcon = document.querySelector(".captcha-recognition-icon");
            if (captchaIcon) {
              // console.log("应用 nportal.ntut.edu.tw 网站的特殊处理");
              captchaIcon.parentNode.removeChild(captchaIcon);
              authcodeElement.appendChild(captchaIcon);
              observer.disconnect();
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }

      if (window.location.host == "www.luogu.com.cn") {
        // console.log("检测到特殊网站：www.luogu.com.cn，应用兼容性处理");
        const styleluogu = document.createElement("style");
        styleluogu.textContent = `
          .l-form-layout .img .captcha-recognition-icon {
            display: none !important;
          }
        `;
        document.head.appendChild(styleluogu);
        const observer = new MutationObserver(function (mutations) {
          const authcodeElement = document.querySelector(".l-form-layout .img");
          if (authcodeElement) {
            const captchaIcon = document.querySelector(".captcha-recognition-icon");
            if (captchaIcon) {
              // console.log("应用 www.luogu.com.cn 网站的特殊处理");
              captchaIcon.parentNode.removeChild(captchaIcon);
              authcodeElement.parentNode.insertBefore(
                captchaIcon,
                authcodeElement.nextSibling
              );
              observer.disconnect();
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } catch (error) {
      console.error("验证码识别插件创建阶段出错：", error);
    }
  },
};
</script>
