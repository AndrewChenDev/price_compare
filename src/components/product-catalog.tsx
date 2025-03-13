'use client'

import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import * as excelColumnName from 'excel-column-name';

interface Product {
  item: any[]
  oldPrice: number
  newPrice: number
}

export function ProductCatalog() {
  const calculateDiscount = (oldPrice: number, newPrice: number) => {
    const discount = ((oldPrice - newPrice) / oldPrice) * 100
    return discount.toFixed(2)
  }


  const products: Product[] =[{"item":["Zenbook S 13\nOLED","打造全新 AI 體驗、提升工作效率\n最高搭載Core Ultra 7 AI 處理器 / Evo認證\n整合Intel Arc顯示晶片\n1kg / 1cm極致輕薄\n專屬 Copilot 鍵，進行更多 AI 探索\n13.3\"3K OLED / 85% 屏佔比\nPD充電 / Thunderbolt™ 4*2\n背光鍵盤 /軍規認證/全機金屬/可180度開合\nIR Webcam支援人臉辨識\nHarman Kardon 認證音效\n支援Dolby Atmos多維度音效\nPANTONE® 認證/100% DCI-P3\nTÜV護眼認證 / SGS低藍光認證\n\n附Adobe Creative Cloud三個月免費訂閱\n(價值$15,153)  即刻體驗AI創作","UX5304MA-0032I155U","90NB12V2-M005Y0","磐石灰\n(電漿陶瓷鋁合金)","13.3\" 3K (2880 x 1800) OLED\n16:10 aspect ratio","V","Intel® Core™ Ultra 7 Processor 155U 1.7 GHz (12MB Cache, up to 4.8 GHz, 12 cores, 14 Threads)\n Intel® AI Boost NPU","V","32GB LPDDR5X on board","1TB M.2 NVMe™ PCIe® 4.0 SSD","Intel® Graphics","Wi-Fi 6E (802.11ax)","Bluetooth 5.3","IR","V","V",1,"63\nWHrs","1x USB 3.2 Gen 2 Type-A\n2x Thunderbolt™ 4 supports display / power delivery\n1x HDMI 2.1 TMDS\n1x 3.5mm Combo Audio Jack",41529,42029,44130,45900,49900,"64 Bits Windows 11","英文/泰文/簡中(亞洲)/印尼文/越南文/繁中","v(保護袋)","X","USB-C to USB-A adapter"],"oldPrice":41529,"newPrice":42433},{"item":[null,null,"UX5304MA-0022I125U","90NB12V2-M005X0","磐石灰\n(電漿陶瓷鋁合金)","13.3\" 3K (2880 x 1800) OLED\n16:10 aspect ratio","V","Intel® Core™ Ultra 5 Processor 125U 1.3 GHz (12MB Cache, up to 4.3 GHz, 12 cores, 14 Threads)\n Intel® AI Boost NPU","V","16GB LPDDR5X on board","512GB M.2 NVMe™ PCIe® 4.0 SSD","Intel® Graphics","Wi-Fi 6E (802.11ax)","Bluetooth 5.3","IR","V","V",1,"63\nWHrs","1x USB 3.2 Gen 2 Type-A\n2x Thunderbolt™ 4 supports display / power delivery\n1x HDMI 2.1 TMDS\n1x 3.5mm Combo Audio Jack",36100,36600,38430,39900,43900,"64 Bits Windows 11","英文/泰文/簡中(亞洲)/印尼文/越南文/繁中","v(保護袋)","X","USB-C to USB-A adapter"],"oldPrice":36100,"newPrice":37005},{"item":[null,"打造全新 AI 體驗、提升工作效率\nAMD 7000 R7高效Razen AI處理器 (NPU)\n16:10 2.8K OLED /89% 屏佔比\n最高 550 尼特峰值亮度/100% DCI-P3\n極致輕薄只有1kg 14.9mm\n抗菌處理技術 /PD充電/軍規認證/ NumPad(白色無)\nFingerPrint / 三件金屬機身 / 背光鍵盤\nHarman Kardon 認證音效\n支援Dolby Atmos多維度音效\nPANTONE® 認證/Delta-E <1的色彩準確度\n\n附Adobe Creative Cloud三個月免費訂閱\n(價值$15,153)  即刻體驗AI創作","UM5302LA-0198W7840U","90NB1235-M00750","優雅白","13.3\" Touch 2.8K (2880 x 1800) OLED\n16:10 aspect ratio","V","AMD Ryzen™ 7 7840U Mobile Processor 3.0GHz (8-core/16-thread, 16MB cache, up to 5.1GHz max boost)\n\nNPU Performance 最高可達 10 TOPS",null,"16GB LPDDR5\non board","512GB M.2 NVMe™ PCIe® 4.0 SSD","AMD Radeon™ Graphics","Wi-Fi 6E (802.11ax)","Bluetooth 5.3","Finger Print","V","V",1.1,"67\nWHrs","1x USB 3.2 Gen 2 Type-C support display / power delivery\n2x USB 4.0 Gen 3 Type-C support display / power delivery\n1x 3.5mm Combo Audio Jack",31576,32076,33680,34900,38900,"64 Bits Windows 11","英文/泰文/簡中(亞洲)/印尼文/越南文/繁中","v(保護袋)","X","USB-C to USB-A adapter"],"oldPrice":31576,"newPrice":32481},{"item":[null,null,"UM5302LA-0088D7840U","90NB1236-M00480","裸粉色","13.3\" Touch 2.8K (2880 x 1800) OLED\n16:10 aspect ratio","V","AMD Ryzen™ 7 7840U Mobile Processor 3.0GHz (8-core/16-thread, 16MB cache, up to 5.1GHz max boost)\n\nNPU Performance 最高可達 10 TOPS",null,"16GB LPDDR5\non board","512GB M.2 NVMe™ PCIe® 4.0 SSD","AMD Radeon™ Graphics","Wi-Fi 6E (802.11ax)","Bluetooth 5.3","Finger Print","V","V",1.1,"67\nWHrs","1x USB 3.2 Gen 2 Type-C support display / power delivery\n2x USB 4.0 Gen 3 Type-C support display / power delivery\n1x 3.5mm Combo Audio Jack",31576,32076,33680,34900,38900,"64 Bits Windows 11","英文/泰文/簡中(亞洲)/印尼文/越南文/繁中","v(保護袋)","X","USB-C to USB-A adapter"],"oldPrice":31576,"newPrice":32481},{"item":["Zenbook 14\nOLED","打造全新 AI 體驗、提升工作效率\n最高搭載Core Ultra 7 AI 處理器 / Evo認證\n整合Intel Arc顯示晶片\n1.2kg / 14.9mm極致輕薄\n14\"FHD OLED / 87% 屏佔比\nPD充電 / Thunderbolt™ 4*2\n75WHrs大電量/NumPad\n背光鍵盤 /軍規認證/全機金屬/可180度開合\nIR Webcam支援人臉辨識\nHarman Kardon 認證音效\n支援Dolby Atmos多維度音效\n自動調整螢幕亮度與色調/100% DCI-P3\nTÜV護眼認證 / SGS低藍光認證\n\n附Adobe Creative Cloud一個月免費訂閱\n(價值$5051)\n即刻體驗AI創作","UX3405MA-0142B155H","90NB11R1-M005E0","紳士藍","14\"FHD (1920 x 1200) OLED\n16:10 aspect ratio","V","Intel® Core™ Ultra 7 Processor 155H 1.4 GHz (24MB Cache, up to 4.8 GHz, 16 cores, 22 Threads)\n Intel® AI Boost NPU","V","32GB LPDDR5X on board","1TB M.2 NVMe™ PCIe® 4.0 SSD","Intel® Arc™ Graphics","Wi-Fi 6E (802.11ax)","Bluetooth 5.3","IR","V","V",1.2,"75\nWHrs","1x USB 3.2 Gen 1 Type-A\n2x Thunderbolt™ 4 supports display / power delivery\n1x HDMI 2.1 TMDS\n1x 3.5mm Combo Audio Jack",37910,38410,40331,41900,45900,"64 Bits Windows 11","英文/泰文/簡中(亞洲)/印尼文/越南文/繁中","v(保護袋)","X"],"oldPrice":37910,"newPrice":38814}]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Product Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-lg">
                {product.item[3] || `Product ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                  {product.item.map((value, idx)=>{
                      return (
                          value !== null && (
                              <div key={idx} className="flex justify-between">
                                  <dt className="font-medium">{excelColumnName.intToExcelCol(idx+1)}:</dt>
                                  <dd className="text-right">{value}</dd>
                              </div>
                          )
                      )
                  })}
                <div className="flex justify-between">
                  <dt className="font-medium">Old Price:</dt>
                  <dd className="text-right">${product.oldPrice.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">New Price:</dt>
                  <dd className="text-right">${product.newPrice.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="font-medium">Price Change:</dt>
                  <dd>
                    <Badge variant="secondary">
                      {calculateDiscount(product.newPrice, product.oldPrice)}%
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
