const { withPodfile } = require('@expo/config-plugins');

module.exports = function withFirebaseModularHeaders(config) {
  return withPodfile(config, (podfileConfig) => {
    // 加上一個日誌，以便我們在 EAS Build 的 log 中確認這個外掛被執行了
    console.log("✅ Running withFirebaseModularHeaders plugin to fix Firebase iOS build issues.");

    // 直接在 Podfile 中插入 use_modular_headers!，這是更全局的修復方式
    const contents = podfileConfig.modResults.contents;
    const useModularHeaders = "use_modular_headers!";
    if (!contents.includes(useModularHeaders)) {
      // 在 'platform :ios' 這一行下面插入
      podfileConfig.modResults.contents = contents.replace(
        /platform :ios, '.+'\n/,
        `platform :ios, '13.4'\n${useModularHeaders}\n`
      );
    }
    
    // 同時保留針對 GoogleUtilities 的精準修復，作為雙重保險
    const postInstall = `installer.pods_project.targets.each do |target|
      if target.name == 'GoogleUtilities'
        target.build_configurations.each do |config|
          config.build_settings['DEFINES_MODULE'] = 'YES'
        end
      end
    end`;
    
    // 使用正則表達式確保能找到 post_install 區塊
    if (!contents.includes("target.name == 'GoogleUtilities'")) {
       podfileConfig.modResults.contents = podfileConfig.modResults.contents.replace(
        /post_install do \|installer\|/,
        `post_install do |installer|\n  ${postInstall}`
       );
    }

    return podfileConfig;
  });
};