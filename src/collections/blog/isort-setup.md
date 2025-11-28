---
title: "My Basic isort Configuration"
date: "2019-08-20"
tags:
  - "python"
  - "tooling"
  - "coding"
  - "code-review"
slug: "my-basic-isort-configuration"
heroImage: "blog/sorting"
expires: true
unsplash: "Sophie Elvis"
unsplashURL: "thetechomaid"
---

In an attempt to remove areas of [bikeshedding](https://en.wikipedia.org/wiki/Law_of_triviality) in our code reviews, I have slowly been implementing format automation to our codebase at [TrackMaven](https://trackmaven.com). The first large leap we took was to implement [Black](https://black.readthedocs.io/en/stable/) for our backend Python code and [Prettier](https://prettier.io/) for our frontend Javascript code.

The next area of contention that I took to fixing was the ordering of imports for our Python code. Now this is certainly something that bothers me more than anyone of my coworkers, but I thought I'd share a neat third-party solution I found called [isort](https://github.com/timothycrosley/isort) and some the now "default" configuration I will be using for all my Python code in the future.

## Why isort?

One might be asking why you'd go to such lengths to make sure my packages are sorted to my liking? I do not think it is the fact that this level of interaction with my code keeps me sane, but it really does help unify a very large code base and it removes the distraction of bikeshedding in code reviews. You want your code reviews to be as pertinent to the code as you can, and adding packages like Black, Prettier, and iSort really helps with that problem. I could see this as overkill, but hopefully as you can see below, setting up iSort to fit your needs is not that difficult.

## My Configuration

The `isort.cfg` file is pretty basic for our Django application. You can see it all in its entirety below:

```ini
[settings]
line_length=120
multi_line_output=3
known_django=django
sections=FUTURE,STDLIB,THIRDPARTY,DJANGO,LOCALFOLDER,FIRSTPARTY
no_lines_before=FIRSTPARTY
```

However, in its simplicity lies a lot of power and customizability. Below, I will discuss the few settings we have here:

- First, we current use a line length of 120 here at TrackMaven. The standard for Python is 80, but I have always thought that was an antiquated practice at best. 120 characters gives our code some room to breath without allowing for code to run wild.
- Second, the `multi_line_output` variable is set to 3, which equates to "Vertical Hanging Indent." This is really a personal preference and the options can be found [here](https://github.com/timothycrosley/isort#multi-line-output-modes). Below is a simple example of "Vertical Hanging Indent"

```python
from third_party import (
    lib1,
    lib2,
    lib3,
    lib4,
)
```

- Third, fourth, and fifth all deal with how our packages are laid out. The third line is telling `isort` we are using Django. The forth line is indicating the ordering for each package. **NOTE**: `DJANGO` can be used because we set the `known_django` variable. (There are a bunch of these "known" variable, `known_standard_library`, `known_first_party`, `known_third_party`, `known_{source_of_your_choice}`, etc.) And lastly, the fifth line indicates that there should be no line spacing between the LOCALFOLDER and FIRSTPART applications. Again, this is just a personal preference.

## Conclusion

What does this mean to you? This package just implements another of the growing packages that remove decision-making from the developer to create clean, consistent code across your team. Below is an example of how this worked in our real-world application.

```python
########## BEFORE ##########
from django.db.models.signals import post_save, post_delete

from core.my_package.signals import save_package, remove_package

from request.helpers import bulk

from .foo import get_foo
from core.my_package.constants import PACKAGE_MAPPING
from core.companies.models import Company

########## AFTER ##########
from request.helpers import bulk

from django.db.models.signals import post_save, post_delete

from .foo import get_foo
from core.my_package.constants import PACKAGE_MAPPING
from core.my_package.signals import save_package, remove_package
from core.companies.models import Company
```

Isn't that just infinitely better? This is now one more thing developers do not have to think about when coding! Let me know what you think, find me on [Twitter](https://twitter.com/joshfinnie) and we'll discuss.
