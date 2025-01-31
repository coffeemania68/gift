document.addEventListener('DOMContentLoaded', async () => {
    const resultsGrid = document.getElementById('results-grid');
    const urlParams = new URLSearchParams(window.location.search);
    
    // 선택된 필터 값들 가져오기
    const filters = {
        gender: urlParams.get('gender'),
        age: urlParams.get('age'),
        relation: urlParams.get('relation'),
        season: urlParams.get('season'),
        price: urlParams.get('price'),
        category: urlParams.get('category')
    };

    try {
        // 상품 데이터 로드
        const response = await fetch('../data/products.json');
        const data = await response.json();

        // 필터링된 상품들
        const filteredProducts = data.gifts.filter(product => {
            return (
                (filters.gender === 'a' || product.gender.includes(filters.gender)) &&
                (product.ageGroup.includes(filters.age)) &&
                (filters.relation === 'a' || product.relation.includes(filters.relation)) &&
                (filters.season === 'a' || product.season.includes(filters.season)) &&
                (product.priceRange === filters.price) &&
                (product.category === filters.category)
            );
        });

        if (filteredProducts.length === 0) {
            // 결과가 없을 때
            resultsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">😅</div>
                    <h2 class="text-2xl font-bold text-gray-700 mb-2">
                        앗! 조건에 맞는 선물을 찾지 못했어요
                    </h2>
                    <p class="text-gray-600 mb-6">
                        다른 조건으로 다시 찾아볼까요?
                    </p>
                </div>
            `;
        } else {
            // 결과 카드 생성
            filteredProducts.forEach((product, index) => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 opacity-0';
                card.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
                
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" 
                         class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">${product.name}</h3>
                        <p class="text-primary font-semibold mb-4">${formatPrice(product.priceRange)}</p>
                        <a href="${product.affiliateLink}" target="_blank" 
                           class="block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition">
                            구매하기 🛍️
                        </a>
                    </div>
                `;
                
                resultsGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">😢</div>
                <h2 class="text-2xl font-bold text-gray-700">
                    일시적인 오류가 발생했습니다
                </h2>
            </div>
        `;
    }
});

// 가격대 포맷 함수
function formatPrice(priceRange) {
    const ranges = {
        '1m': '1만원대',
        '3m': '3만원대',
        '5m': '5만원대',
        '10m': '10만원대',
        '20m': '20만원대',
        'under50': '50만원 미만',
        'over50': '50만원 이상'
    };
    return ranges[priceRange] || priceRange;
}
