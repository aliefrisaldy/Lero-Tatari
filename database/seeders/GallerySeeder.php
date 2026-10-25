<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Seed the gallery with high-fidelity placeholder photos.
     */
    public function run(): void
    {
        if (Gallery::count() > 0) {
            return;
        }

        $items = [
            [
                'title' => 'Musrenbangdes Penetapan RKPDes',
                'captured_at' => '2024-01-10',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB2uMyrj0K8lTLRtJqpUO2Lh0wIsmX_8Bbb0HA1Hz89z0Cfspmg_EKY5-VO5kxda8M5dlwytnSV2vu7eOjr6IZd-jMyp7v9bCPngVO5aTqNH5__kSKKuSMOCczM85_mvPUXmYvQviHhWpT65cbxT3_qJhdjsqPvNh9m8cv2PBD3aovtAo-I7laPH84JYtg_nRGIzyR5cBaois-wQPxVZ2cz9AdJDqNF75fV3cze3MrwiLcBqRQWlIT',
            ],
            [
                'title' => 'Parade Perahu Hias Nelayan Teluk Tatari',
                'captured_at' => '2024-08-17',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYE6vM7WGhhBlPOAYCjtxk2oiOMxf9FIyOXSIaNrwA-UfTFwjgqKycNBGr57-P2txe0pxL_PKp5VkABAHrVvVAlToirke4qt-ERCO5tK8_VWoWroG-pZrM7IfBCgonAkG9tPwuTh41QgkJpr2NPcbbWhujp3cpRJbatEL_lTssDpLkC2Xs6MUQlCw2nmhsRrPJ0FSeOXfIzAoJ-bt1CF-LBUQAmnH7CHKT5LwOaDGEVcUUT3O688An',
            ],
            [
                'title' => 'Turnamen Olahraga Pemuda Desa Lero Tatari',
                'captured_at' => '2024-09-02',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEDJZ5JIIFjsAJmjzNxYaS6BMrU-c18aFn8XSyIBRO92-fuwVrMWGjQAS4Q69mWj3y9A4LDTbwkSYDTz7QK5bD_e8yKPGBSmnzcyGCaLBeFwiJr5UhVqF2X7MjLywXlL8lKTahIhphDMw6u0TjFVXdJwWepodMUk3vqpRl4-eU2QIh3Fx1_ULDD8ijuzbfULZMflUOvm3or1WucY9mJltR_w6L197jtRZvIfC8_o4XDnHvfqWiEg6D',
            ],
            [
                'title' => 'Lokakarya Digital & Kewirausahaan Karang Taruna',
                'captured_at' => '2024-10-21',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2_ArbYlq3-QVMQF5cOmEGJ7LuvzTR2EiRZ-T9-qzf8fyjBODz8HP2CrN8dIHswuLLoXJewFtmb7GoYnM17zixYhg36S7IgipTxdhNXs1TwZMYRwGQM5zMf_TN8XCJ8kKNnc7VIMEmN8OEorm6r12yRZYJCoelLL4dbN8WqKgAF65AEeS1Xhw5zcLlfSRwb02iWNHtqJ3GhE2vpE5CqDa1-nolOYCqJLxfnHG7-aoSG9sfXIU2TLTX',
            ],
        ];

        foreach ($items as $index => $item) {
            Gallery::create(array_merge($item, [
                'is_active' => true,
                'order_index' => $index + 1,
            ]));
        }
    }
}
