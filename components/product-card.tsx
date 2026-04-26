{/* Image Container */}
<div className="relative w-full h-[260px] bg-muted overflow-hidden rounded-t-xl">
  <Image
    src={product.thumbnail}
    alt={product.title}
    width={500}
    height={500}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  />

  {/* Discount Badge */}
  {hasDiscount && (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-3 left-3"
    >
      <Badge className="bg-rose-500 hover:bg-rose-500 gap-1">
        <BadgePercent className="h-3 w-3" />
        {Math.round(product.discountPercentage)}% OFF
      </Badge>
    </motion.div>
  )}

  {/* Wishlist Button */}
  <button
    onClick={handleWishlist}
    className={cn(
      "absolute top-3 right-3 p-2 rounded-full transition-all duration-200",
      "bg-background/80 backdrop-blur-sm hover:bg-background",
      wishlisted ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
    )}
  >
    <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
  </button>
</div>