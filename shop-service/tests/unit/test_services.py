"""
购物服务单元测试
测试左移 - 补写完整测试用例
"""
import pytest
from decimal import Decimal
from sqlalchemy.orm import Session

from app.models.goods import Goods
from app.models.cart import Cart
from app.models.order import Order, OrderItem
from app.schemas.cart import CartCreate, CartUpdate
from app.schemas.order import OrderCheckout, OrderCartCheckout
from app.services.goods_service import GoodsService
from app.services.cart_service import CartService
from app.services.order_service import OrderService


class TestGoodsService:
    """商品服务测试"""

    def test_get_goods_by_id_success(self, db_session: Session):
        """测试成功根据ID获取商品"""
        # 准备数据
        goods = Goods(
            name="iPhone 15 Pro",
            price=Decimal("7999.00"),
            intro="测试商品",
            stock=100
        )
        db_session.add(goods)
        db_session.commit()

        # 执行
        result = GoodsService.get_goods_by_id(db_session, goods.goods_id)

        # 验证
        assert result is not None
        assert result.goods_id == goods.goods_id
        assert result.name == "iPhone 15 Pro"

    def test_get_goods_by_id_not_found(self, db_session: Session):
        """测试获取不存在的商品"""
        result = GoodsService.get_goods_by_id(db_session, 9999)
        assert result is None

    def test_get_goods_list_pagination(self, db_session: Session):
        """测试商品列表分页"""
        # 准备15个商品
        for i in range(15):
            goods = Goods(
                name=f"商品{i}",
                price=Decimal(f"{100 + i}.00"),
                stock=10
            )
            db_session.add(goods)
        db_session.commit()

        # 第一页，每页10个
        items, total = GoodsService.get_goods_list(db_session, page=1, size=10)
        assert total == 15
        assert len(items) == 10

        # 第二页，每页10个
        items2, total2 = GoodsService.get_goods_list(db_session, page=2, size=10)
        assert total2 == 15
        assert len(items2) == 5

    def test_get_goods_list_empty(self, db_session: Session):
        """测试空商品列表"""
        items, total = GoodsService.get_goods_list(db_session)
        assert total == 0
        assert len(items) == 0


class TestCartService:
    """购物车服务测试"""

    def test_get_cart_list_empty(self, db_session: Session):
        """测试空购物车"""
        result = CartService.get_cart_list(db_session, user_id=1)
        assert len(result) == 0

    def test_get_cart_list_with_items(self, db_session: Session):
        """测试获取购物车列表（包含商品信息）"""
        # 准备商品
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        # 准备购物车项
        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2, checked=True)
        db_session.add(cart)
        db_session.commit()

        # 执行
        result = CartService.get_cart_list(db_session, user_id=1)

        # 验证
        assert len(result) == 1
        assert result[0].cart_id == cart.cart_id
        assert result[0].goods_name == "测试商品"
        assert result[0].price == Decimal("100.00")
        assert result[0].quantity == 2

    def test_add_to_cart_new_item(self, db_session: Session):
        """测试添加新商品到购物车"""
        # 准备商品
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        # 执行
        cart_data = CartCreate(goods_id=goods.goods_id, quantity=2)
        result = CartService.add_to_cart(db_session, user_id=1, cart_data=cart_data)

        # 验证
        assert result.goods_id == goods.goods_id
        assert result.quantity == 2
        assert result.goods_name == "测试商品"

    def test_add_to_cart_existing_item(self, db_session: Session):
        """测试添加已存在的商品到购物车（数量累加）"""
        # 准备商品
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        # 先添加一次
        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2)
        db_session.add(cart)
        db_session.commit()

        # 再添加一次
        cart_data = CartCreate(goods_id=goods.goods_id, quantity=3)
        result = CartService.add_to_cart(db_session, user_id=1, cart_data=cart_data)

        # 验证数量累加
        assert result.quantity == 5

    def test_add_to_cart_goods_not_found(self, db_session: Session):
        """测试添加不存在的商品"""
        from fastapi import HTTPException

        cart_data = CartCreate(goods_id=9999, quantity=1)
        with pytest.raises(HTTPException) as exc_info:
            CartService.add_to_cart(db_session, user_id=1, cart_data=cart_data)
        assert exc_info.value.status_code == 404

    def test_update_cart_item_quantity(self, db_session: Session):
        """测试更新购物车数量"""
        # 准备数据
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2, checked=True)
        db_session.add(cart)
        db_session.commit()

        # 执行
        cart_data = CartUpdate(cart_id=cart.cart_id, quantity=5)
        result = CartService.update_cart_item(db_session, user_id=1, cart_data=cart_data)

        # 验证
        assert result.quantity == 5

    def test_update_cart_item_checked(self, db_session: Session):
        """测试更新购物车选中状态"""
        # 准备数据
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2, checked=True)
        db_session.add(cart)
        db_session.commit()

        # 执行
        cart_data = CartUpdate(cart_id=cart.cart_id, checked=False)
        result = CartService.update_cart_item(db_session, user_id=1, cart_data=cart_data)

        # 验证
        assert result.checked is False

    def test_update_cart_item_not_found(self, db_session: Session):
        """测试更新不存在的购物车项"""
        from fastapi import HTTPException

        cart_data = CartUpdate(cart_id=9999, quantity=1)
        with pytest.raises(HTTPException) as exc_info:
            CartService.update_cart_item(db_session, user_id=1, cart_data=cart_data)
        assert exc_info.value.status_code == 404

    def test_update_cart_item_wrong_user(self, db_session: Session):
        """测试更新其他用户的购物车项"""
        from fastapi import HTTPException

        # 准备数据（用户1的购物车）
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2)
        db_session.add(cart)
        db_session.commit()

        # 用户2尝试更新
        cart_data = CartUpdate(cart_id=cart.cart_id, quantity=5)
        with pytest.raises(HTTPException) as exc_info:
            CartService.update_cart_item(db_session, user_id=2, cart_data=cart_data)
        assert exc_info.value.status_code == 404

    def test_delete_cart_item_success(self, db_session: Session):
        """测试删除购物车项"""
        # 准备数据
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2)
        db_session.add(cart)
        db_session.commit()

        # 执行
        CartService.delete_cart_item(db_session, user_id=1, cart_id=cart.cart_id)

        # 验证
        deleted = db_session.query(Cart).filter(Cart.cart_id == cart.cart_id).first()
        assert deleted is None

    def test_delete_cart_item_not_found(self, db_session: Session):
        """测试删除不存在的购物车项"""
        from fastapi import HTTPException

        with pytest.raises(HTTPException) as exc_info:
            CartService.delete_cart_item(db_session, user_id=1, cart_id=9999)
        assert exc_info.value.status_code == 404


class TestOrderService:
    """订单服务测试"""

    def test_get_order_list_empty(self, db_session: Session):
        """测试空订单列表"""
        result = OrderService.get_order_list(db_session, user_id=1)
        assert len(result) == 0

    def test_get_order_list_with_orders(self, db_session: Session):
        """测试获取订单列表"""
        # 准备订单
        order1 = Order(user_id=1, total_price=Decimal("100.00"), status="completed")
        order2 = Order(user_id=1, total_price=Decimal("200.00"), status="completed")
        order3 = Order(user_id=2, total_price=Decimal("300.00"), status="completed")
        db_session.add_all([order1, order2, order3])
        db_session.commit()

        # 执行
        result = OrderService.get_order_list(db_session, user_id=1)

        # 验证（只返回用户1的订单）
        assert len(result) == 2
        order_ids = {r.order_id for r in result}
        assert order_ids == {order1.order_id, order2.order_id}

    def test_get_order_detail_success(self, db_session: Session):
        """测试获取订单详情"""
        # 准备商品
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        # 准备订单
        order = Order(user_id=1, total_price=Decimal("200.00"), status="completed")
        db_session.add(order)
        db_session.flush()

        # 订单项
        order_item = OrderItem(
            order_id=order.order_id,
            goods_id=goods.goods_id,
            quantity=2,
            price=Decimal("100.00")
        )
        db_session.add(order_item)
        db_session.commit()

        # 执行
        result = OrderService.get_order_detail(db_session, user_id=1, order_id=order.order_id)

        # 验证
        assert result is not None
        assert result.order_id == order.order_id
        assert len(result.items) == 1
        assert result.items[0].goods_name == "测试商品"

    def test_get_order_detail_not_found(self, db_session: Session):
        """测试获取不存在的订单"""
        result = OrderService.get_order_detail(db_session, user_id=1, order_id=9999)
        assert result is None

    def test_get_order_detail_wrong_user(self, db_session: Session):
        """测试获取其他用户的订单"""
        # 准备订单（用户1）
        order = Order(user_id=1, total_price=Decimal("100.00"), status="completed")
        db_session.add(order)
        db_session.commit()

        # 用户2尝试获取
        result = OrderService.get_order_detail(db_session, user_id=2, order_id=order.order_id)
        assert result is None

    def test_checkout_direct_success(self, db_session: Session):
        """测试直接购买成功"""
        # 准备商品
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        # 执行
        order_data = OrderCheckout(goods_id=goods.goods_id, quantity=2)
        result = OrderService.checkout_direct(db_session, user_id=1, order_data=order_data)

        # 验证订单
        assert result is not None
        assert result.total_price == Decimal("200.00")
        assert result.status == "completed"

        # 验证库存扣减
        db_session.refresh(goods)
        assert goods.stock == 8

        # 验证订单项
        order = db_session.query(Order).filter(Order.order_id == result.order_id).first()
        assert len(order.items) == 1
        assert order.items[0].quantity == 2

    def test_checkout_direct_goods_not_found(self, db_session: Session):
        """测试直接购买不存在的商品"""
        from fastapi import HTTPException

        order_data = OrderCheckout(goods_id=9999, quantity=1)
        with pytest.raises(HTTPException) as exc_info:
            OrderService.checkout_direct(db_session, user_id=1, order_data=order_data)
        assert exc_info.value.status_code == 404

    def test_checkout_direct_insufficient_stock(self, db_session: Session):
        """测试直接购买库存不足"""
        from fastapi import HTTPException

        # 准备商品（库存只有5）
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=5)
        db_session.add(goods)
        db_session.commit()

        # 尝试购买10个
        order_data = OrderCheckout(goods_id=goods.goods_id, quantity=10)
        with pytest.raises(HTTPException) as exc_info:
            OrderService.checkout_direct(db_session, user_id=1, order_data=order_data)
        assert exc_info.value.status_code == 400

    def test_checkout_cart_success(self, db_session: Session):
        """测试购物车结算成功"""
        # 准备两个商品
        goods1 = Goods(name="商品1", price=Decimal("100.00"), stock=10)
        goods2 = Goods(name="商品2", price=Decimal("200.00"), stock=10)
        db_session.add_all([goods1, goods2])
        db_session.commit()

        # 准备购物车项（都勾选）
        cart1 = Cart(user_id=1, goods_id=goods1.goods_id, quantity=2, checked=True)
        cart2 = Cart(user_id=1, goods_id=goods2.goods_id, quantity=1, checked=True)
        db_session.add_all([cart1, cart2])
        db_session.commit()

        # 执行
        order_data = OrderCartCheckout(cart_ids=[cart1.cart_id, cart2.cart_id])
        result = OrderService.checkout_cart(db_session, user_id=1, order_data=order_data)

        # 验证订单
        assert result.total_price == Decimal("400.00")

        # 验证库存扣减
        db_session.refresh(goods1)
        db_session.refresh(goods2)
        assert goods1.stock == 8
        assert goods2.stock == 9

        # 验证购物车项已删除
        deleted1 = db_session.query(Cart).filter(Cart.cart_id == cart1.cart_id).first()
        deleted2 = db_session.query(Cart).filter(Cart.cart_id == cart2.cart_id).first()
        assert deleted1 is None
        assert deleted2 is None

    def test_checkout_cart_no_checked_items(self, db_session: Session):
        """测试购物车结算没有勾选的商品"""
        from fastapi import HTTPException

        # 准备商品和购物车（未勾选）
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=10)
        db_session.add(goods)
        db_session.commit()

        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=2, checked=False)
        db_session.add(cart)
        db_session.commit()

        # 执行
        order_data = OrderCartCheckout(cart_ids=[cart.cart_id])
        with pytest.raises(HTTPException) as exc_info:
            OrderService.checkout_cart(db_session, user_id=1, order_data=order_data)
        assert exc_info.value.status_code == 400

    def test_checkout_cart_insufficient_stock(self, db_session: Session):
        """测试购物车结算库存不足"""
        from fastapi import HTTPException

        # 准备商品（库存只有3）
        goods = Goods(name="测试商品", price=Decimal("100.00"), stock=3)
        db_session.add(goods)
        db_session.commit()

        # 购物车要5个
        cart = Cart(user_id=1, goods_id=goods.goods_id, quantity=5, checked=True)
        db_session.add(cart)
        db_session.commit()

        # 执行
        order_data = OrderCartCheckout(cart_ids=[cart.cart_id])
        with pytest.raises(HTTPException) as exc_info:
            OrderService.checkout_cart(db_session, user_id=1, order_data=order_data)
        assert exc_info.value.status_code == 400
